/** @jsx jsx */
import {
    useGetTicketExistenceQuery,
    useGetTicketsCountLazyQuery,
    useGetTicketsCountQuery,
    useGetTicketsQuery,
} from '@app/condo/gql'
import { SortTicketsBy, TicketStatusTypeType } from '@app/condo/schema'
import { jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { Col, Modal, Row, RowProps } from 'antd'
import get from 'lodash/get'
import isNull from 'lodash/isNull'
import isNumber from 'lodash/isNumber'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TableComponents } from 'rc-table/lib/interface'
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useFeatureFlags } from '@open-condo/featureflags/FeatureFlagsContext'
import { PlusCircle, Search } from '@open-condo/icons'
import { useIntl } from '@open-condo/next/intl'
import { useOrganization } from '@open-condo/next/organization'
import { Typography, RadioGroup, Radio, Space } from '@open-condo/ui'
// TODO(DOMA-4844): Replace with @open-condo/ui/colors
import { colors } from '@open-condo/ui/dist/colors'

import Input from '@condo/domains/common/components/antd/Input'
import { PageHeader, PageWrapper, useLayoutContext } from '@condo/domains/common/components/containers/BaseLayout'
import { TablePageContent } from '@condo/domains/common/components/containers/BaseLayout/BaseLayout'
import LoadingOrErrorPage from '@condo/domains/common/components/containers/LoadingOrErrorPage'
import { EmptyListContent } from '@condo/domains/common/components/EmptyListContent'
import { ImportWrapper } from '@condo/domains/common/components/Import/Index'
import { Loader } from '@condo/domains/common/components/Loader'
import { DEFAULT_PAGE_SIZE, Table, TableRecord } from '@condo/domains/common/components/Table/Index'
import { TableFiltersContainer } from '@condo/domains/common/components/TableFiltersContainer'
import { useTracking } from '@condo/domains/common/components/TrackingContext'
import { useWindowTitleContext, WindowTitleContextProvider } from '@condo/domains/common/components/WindowTitleContext'
import { EMOJI } from '@condo/domains/common/constants/emoji'
import { TICKET_IMPORT } from '@condo/domains/common/constants/featureflags'
import { useAudio } from '@condo/domains/common/hooks/useAudio'
import { useGlobalHints } from '@condo/domains/common/hooks/useGlobalHints'
import {
    MultipleFilterContextProvider,
    FiltersTooltip,
} from '@condo/domains/common/hooks/useMultipleFiltersModal'
import { usePreviousSortAndFilters } from '@condo/domains/common/hooks/usePreviousQueryParams'
import { useQueryMappers } from '@condo/domains/common/hooks/useQueryMappers'
import { useSearch } from '@condo/domains/common/hooks/useSearch'
import { PageComponentType } from '@condo/domains/common/types'
import { getFiltersQueryData } from '@condo/domains/common/utils/filters.utils'
import { updateQuery } from '@condo/domains/common/utils/helpers'
import { getPageIndexFromOffset, parseQuery } from '@condo/domains/common/utils/tables.utils'
import ProjectTicketCreate from '@condo/domains/kanban/components/TicketCreate/TicketCreate'
import ProjectBoardTicketDetails from '@condo/domains/kanban/components/TicketDetails'
import Button from '@condo/domains/kanban/ui/Button'
import { TicketReadPermissionRequired } from '@condo/domains/ticket/components/PageAccess'
import {
    AutoRefetchTicketsContextProvider,
    useAutoRefetchTickets,
} from '@condo/domains/ticket/contexts/AutoRefetchTicketsContext'
import {
    FavoriteTicketsContextProvider,
    useFavoriteTickets,
} from '@condo/domains/ticket/contexts/FavoriteTicketsContext'
import { useTicketVisibility } from '@condo/domains/ticket/contexts/TicketVisibilityContext'
import { useFiltersTooltipData } from '@condo/domains/ticket/hooks/useFiltersTooltipData'
import { useImporterFunctions } from '@condo/domains/ticket/hooks/useImporterFunctions'
import { useTableColumns } from '@condo/domains/ticket/hooks/useTableColumns'
import { useTicketTableFilters } from '@condo/domains/ticket/hooks/useTicketTableFilters'
import { IFilters } from '@condo/domains/ticket/utils/helpers'


type TicketType = 'all' | 'own' | 'favorite'

const LARGE_VERTICAL_ROW_GUTTER: RowProps['gutter'] = [0, 40]
const MEDIUM_VERTICAL_ROW_GUTTER: RowProps['gutter'] = [0, 24]
const HEADER_STYLES: CSSProperties = { padding: 0 }


const StyledTable = styled(Table)`
  .ant-checkbox-input {
    width: 50px;
    height: calc(100% + 32px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ant-table-scroll-horizontal .ant-checkbox-input {
    width: 40px;
  }

  .comments-column {
    padding: 0;
    padding-top: 14px;
    width: 8px;
  }

  .number-column {
    padding-left: 0;
  }

  .favorite-column {
    padding: 16px 16px 16px 8px;
  }

  .ant-table-selection-column {
    padding-top: 12px;
  }
`

const TicketTable = ({
    sortBy,
    total,
    tickets,
    columns,
    filters,
    loading,
    searchTicketsQuery,
    TicketImportButton,
}) => {
    const router = useRouter()

    const tooltipData = useFiltersTooltipData()

    const handleRowAction = useCallback((record) => {
        return {
            onClick: async () => {
                const currentUrl = new URL(window.location.href)
                currentUrl.searchParams.set('ticketId', record.id)
                await router.push(currentUrl.toString(), undefined, { shallow: true })
            },
        }
    }, [router])

    const tableComponents: TableComponents<TableRecord> = useMemo(() => ({
        body: {
            row: (props) => (
                <FiltersTooltip
                    filters={filters}
                    tooltipData={tooltipData}
                    total={total}
                    tickets={tickets}
                    {...props}
                />
            ),
        },
    }), [tooltipData, filters, tickets, total])

    return (
        <Row gutter={[0, 40]}>
            <Col span={24}>
                <StyledTable
                    totalRows={total}
                    loading={loading}
                    dataSource={loading ? null : tickets}
                    columns={columns}
                    onRow={handleRowAction}
                    components={tableComponents}
                    data-cy='ticket__table'
                    sticky
                />
            </Col>
        </Row>
    )
}

const TicketsTableContainer = ({
    filterMetas,
    sortBy,
    searchTicketsQuery,
    useTableColumns,
    baseQueryLoading,
    TicketImportButton,
    playSoundOnNewTickets,
}) => {
    const intl = useIntl()
    const [isTicketOpen, setIsTicketOpen] = useState(false)
    const [isTicketCreateOpen, setIsTicketCreateOpen] = useState(false)
    const router = useRouter()
    const { filters, offset } = useMemo(() => parseQuery(router.query), [router.query])
    const { organization } = useOrganization()
    const [isRefetching, setIsRefetching] = useState(false)
    const ticketsCountRef = useRef(null)
    const audio = useAudio()
    const { setTitleConfig, unreadCount } = useWindowTitleContext()

    const currentPageIndex = useMemo(() => getPageIndexFromOffset(offset, DEFAULT_PAGE_SIZE), [offset])

    const {
        loading: isTicketsFetching,
        data: ticketsData,
        refetch,
    } = useGetTicketsQuery({
        variables: {
            // NOTE: we have index "ticket_order_createdat" for sorting by order ASC, createdAt DESC.
            // If you change sort condition, you need to change index
            sortBy,
            where: searchTicketsQuery,
            first: DEFAULT_PAGE_SIZE,
            skip: (currentPageIndex - 1) * DEFAULT_PAGE_SIZE,
        },
        fetchPolicy: 'network-only',
    })
    const tickets = useMemo(() => ticketsData?.tickets?.filter(Boolean) || [], [ticketsData?.tickets])
    const total = useMemo(() => ticketsData?.meta?.count, [ticketsData?.meta?.count])

    const [loadNewTicketCount] = useGetTicketsCountLazyQuery({
        onCompleted: ({ meta: { count } }) => {
            if (!isNull(ticketsCountRef.current) && ticketsCountRef.current < count) {
                const totalNewTicketsCount = count - ticketsCountRef.current + unreadCount

                const iconPath = totalNewTicketsCount > 9
                    ? '/favicons/infinity.svg'
                    : `/favicons/${totalNewTicketsCount}.svg`
                const newTitle = totalNewTicketsCount > 9
                    ? intl.formatMessage({ id: 'pages.condo.ticket.index.manyNewTicketsTitle' })
                    : intl.formatMessage({ id: 'pages.condo.ticket.index.fewNewTicketsTitle' }, { count: totalNewTicketsCount })

                setTitleConfig({ label: newTitle, iconPath, count: totalNewTicketsCount })
                audio.playNewItemsFetchedSound()
            }
            ticketsCountRef.current = count
        },
        onError: () => {
            ticketsCountRef.current = null
        },
        fetchPolicy: 'network-only',
        variables: {
            where: {
                AND: [
                    pick(searchTicketsQuery, 'organization'), { status: { type: TicketStatusTypeType.NewOrReopened } },
                ],
            },
        },
    })

    const refetchTickets = useCallback(async () => {
        await refetch()

        if (playSoundOnNewTickets) {
            await loadNewTicketCount()
        }
    }, [loadNewTicketCount, playSoundOnNewTickets, refetch])

    const {
        columns,
        loading: columnsLoading,
    } = useTableColumns(filterMetas, tickets, refetchTickets, isRefetching, setIsRefetching)

    useEffect(() => {
        if (router.query.ticketId && !isTicketOpen) {  
            setIsTicketOpen(true)
        }  else if (router.query['create-modal']) {
            setIsTicketCreateOpen(true)
        }
    }, [router.query]) 

    useEffect(() => {
        if (playSoundOnNewTickets) {
            loadNewTicketCount()
        }
    }, [loadNewTicketCount, playSoundOnNewTickets])

    const handleCloseModals = async () => {
        setIsTicketCreateOpen(false)
        setIsTicketOpen(false)
        const newQuery = router.query
        delete newQuery.ticketId
        delete newQuery['create-modal'] 

        await router.push({
            pathname: router.pathname,
            query: newQuery,
        }, undefined, { shallow: true })
    }

    const loading = (isTicketsFetching || columnsLoading || baseQueryLoading) && !isRefetching 

    return (
        <>
            <Modal zIndex={100} width={1040} open={isTicketCreateOpen} onCancel={handleCloseModals} closable={false} footer={null} style={{ top: 10, padding: 5 }} transitionName=''>
                <ProjectTicketCreate closeModal={handleCloseModals} refetchTicketsBoard={refetchTickets}/>
            </Modal>
            <Modal zIndex={100} width={1040} open={isTicketOpen} onCancel={handleCloseModals} footer={null} style={{ top: 20 }} closable={false} transitionName=''>
                <ProjectBoardTicketDetails handleCloseModals = {handleCloseModals} refetchTicketsBoard={refetchTickets}/>
            </Modal>
            <TicketTable
                filters={filters}
                total={total}
                tickets={tickets}
                loading={loading}
                columns={columns}
                searchTicketsQuery={searchTicketsQuery}
                sortBy={sortBy}
                TicketImportButton={TicketImportButton}
            />
        </>
    )
}

const SORTABLE_PROPERTIES = ['number', 'status', 'order', 'priority', 'details', 'property', 'unitName', 'assignee', 'executor', 'createdAt', 'clientName']
const TICKETS_DEFAULT_SORT_BY = ['order_ASC', 'createdAt_DESC']
const SMALL_HORIZONTAL_GUTTER: RowProps['gutter'] = [10, 10]
const TICKET_STATUS_FILTER_CONTAINER_ROW_STYLES: CSSProperties = {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    paddingBottom: '20px',
    marginBottom:'10px',
}
const ALL_TICKETS_COUNT_CONTAINER_STYLES: CSSProperties = {
    display: 'flex',
    whiteSpace: 'nowrap',
    alignItems: 'center',
}
const LOADER_STYLES = { display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }

const TicketStatusFilterContainer = ({ searchTicketsQuery, searchTicketsWithoutStatusQuery }) => {
    const intl = useIntl()
    const CreateTicketTitle = intl.formatMessage({ id: 'CreateTicket' })
    const router = useRouter()
    const {
        data: allTicketsCountData,
        loading: allTicketsCountLoading,
    } = useGetTicketsCountQuery({
        variables: {
            where: searchTicketsQuery,
        },
    })
    const allTicketsCount = useMemo(() => allTicketsCountData?.meta?.count, [allTicketsCountData?.meta?.count])

    const loading = allTicketsCountLoading 

    const handleCreateModalOpen = async () => {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('create-modal', 'true')
        await router.push(currentUrl.toString(), undefined, { shallow: true })
    }

    return loading ? <Loader style={LOADER_STYLES}/> : (
        <Row gutter={SMALL_HORIZONTAL_GUTTER} style={TICKET_STATUS_FILTER_CONTAINER_ROW_STYLES}>
            <Col style={ALL_TICKETS_COUNT_CONTAINER_STYLES}>
                <Typography.Text size='large' strong>
                    {
                        intl.formatMessage({ id: 'TicketsCount' }, {
                            ticketsCount: allTicketsCount,
                        })
                    }
                </Typography.Text>
            </Col>
            <Col style={ALL_TICKETS_COUNT_CONTAINER_STYLES}>
                <Button icon={<PlusCircle size='small'/>} onClick = {handleCreateModalOpen}>{CreateTicketTitle}</Button>
            </Col>
        </Row>
    )
}

const FILTERS_CONTAINER_ROW_GUTTER: RowProps['gutter'] = [20, 20]


const FiltersContainer = () => {
    const intl = useIntl()
    const SearchPlaceholder = intl.formatMessage({ id: 'filters.FullSearch' })
    const [search, changeSearch] = useSearch<IFilters>()
    const handleSearchChange = useCallback((e) => {
        changeSearch(e.target.value)
    }, [changeSearch])

    return (
        <>
            <TableFiltersContainer>
                <Row gutter={FILTERS_CONTAINER_ROW_GUTTER} align='middle'>
                    <Col span={24}>
                        <Input
                            placeholder={SearchPlaceholder}
                            onChange={handleSearchChange}
                            value={search}
                            allowClear
                            suffix={<Search size='medium' color={colors.gray[7]}/>}
                        />
                    </Col>
                </Row>
            </TableFiltersContainer>
        </>
    )
}

export const TicketsPageContent = ({
    filterMetas,
    useTableColumns,
    baseTicketsQuery,
    sortableProperties,
    showImport = false,
    loading = false,
    isTicketsExists,
    playSoundOnNewTickets = false,
    error,
}): JSX.Element => {
    const intl = useIntl()
    const EmptyListLabel = intl.formatMessage({ id: 'ticket.EmptyList.header' })
    const EmptyListManualBodyDescription = intl.formatMessage({ id: 'ticket.EmptyList.manualCreateCard.body.description' })
    const ServerErrorMsg = intl.formatMessage({ id: 'ServerError' })

    const router = useRouter()
    const { role } = useOrganization()
    const { filters, sorters } = parseQuery(router.query)
    const { filtersToWhere, sortersToSortBy } = useQueryMappers(filterMetas, sortableProperties)
    const sortBy = sortersToSortBy(sorters, TICKETS_DEFAULT_SORT_BY) as SortTicketsBy[]
    const searchTicketsQuery = useMemo(() => ({ ...baseTicketsQuery, ...filtersToWhere(filters) }),
        [baseTicketsQuery, filters, filtersToWhere])
    const searchTicketsWithoutStatusQuery = useMemo(() => ({
        ...baseTicketsQuery,
        ...filtersToWhere(omit(filters, 'status')),
    }),
    [baseTicketsQuery, filters, filtersToWhere])
    const { userFavoriteTickets } = useFavoriteTickets()
    if (filters.type === 'favorite') {
        const favoriteTicketsIds = userFavoriteTickets.map(favoriteTicket => favoriteTicket.ticket.id)
        searchTicketsQuery.id_in = searchTicketsQuery.id_in ? [...searchTicketsQuery.id_in, ...favoriteTicketsIds] : favoriteTicketsIds
        searchTicketsWithoutStatusQuery.id_in = searchTicketsWithoutStatusQuery.id_in ?
            [...searchTicketsWithoutStatusQuery.id_in, ...favoriteTicketsIds] :
            favoriteTicketsIds
    }

    const { useFlag } = useFeatureFlags()
    const isTicketImportFeatureEnabled = useFlag(TICKET_IMPORT)
    const [columns, ticketNormalizer, ticketValidator, ticketCreator] = useImporterFunctions()

    const canManageTickets = useMemo(() => role?.canManageTickets, [role])

    const TicketImportButton = useMemo(() => {
        return canManageTickets && showImport && isTicketImportFeatureEnabled && (
            <ImportWrapper
                accessCheck={isTicketImportFeatureEnabled}
                columns={columns}
                rowValidator={ticketValidator}
                rowNormalizer={ticketNormalizer}
                objectCreator={ticketCreator}
                domainName='ticket'
            />
        )
    }, [canManageTickets, columns, isTicketImportFeatureEnabled, showImport, ticketCreator, ticketNormalizer, ticketValidator])

    if (loading || error) {
        const errorToPrint = error ? ServerErrorMsg : null
        return <LoadingOrErrorPage loading={loading} error={errorToPrint}/>
    }

    if (!isTicketsExists) {
        return (
            <EmptyListContent
                label={EmptyListLabel}
                createRoute='/kanban?create-modal=true'
                accessCheck={canManageTickets}
                importLayoutProps={isTicketImportFeatureEnabled && {
                    manualCreateEmoji: EMOJI.PHONE,
                    manualCreateDescription: EmptyListManualBodyDescription,
                    importCreateEmoji: EMOJI.LIST,
                    importWrapper: {
                        columns: columns,
                        rowNormalizer: ticketNormalizer,
                        rowValidator: ticketValidator,
                        objectCreator: ticketCreator,
                        domainName: 'ticket',
                        onFinish: undefined,
                    },
                }}
            />
        )
    }

    return (
        <>
            <Row gutter={LARGE_VERTICAL_ROW_GUTTER}>
                <Col span={24}>
                    <FiltersContainer />
                </Col>
                <Col span={24}>
                    <TicketStatusFilterContainer
                        searchTicketsQuery={searchTicketsQuery}
                        searchTicketsWithoutStatusQuery={searchTicketsWithoutStatusQuery}
                    />
                </Col>
            </Row>
            <TicketsTableContainer
                filterMetas={filterMetas}
                useTableColumns={useTableColumns}
                sortBy={sortBy}
                searchTicketsQuery={searchTicketsQuery}
                baseQueryLoading={loading}
                TicketImportButton={TicketImportButton}
                playSoundOnNewTickets={playSoundOnNewTickets}
            />
        </>
    )
}

export const TicketTypeFilterSwitch = ({ ticketFilterQuery }) => {
    const intl = useIntl()
    const AllTicketsMessage = intl.formatMessage({ id: 'pages.condo.ticket.filters.TicketType.all' })
    const OwnTicketsMessage = intl.formatMessage({ id: 'pages.condo.ticket.filters.TicketType.own' })
    const router = useRouter()
    const { filters } = useMemo(() => parseQuery(router.query), [router.query])

    const isFavoriteTicketsSelected = filters.type === 'favorite'
    const isOwnTicketsSelected = !isFavoriteTicketsSelected && filters.type === 'own'
    const isAllTicketsSelected = !isFavoriteTicketsSelected && !isOwnTicketsSelected

    const [value, setValue] = useState<TicketType>()
    useEffect(() => {
        if (isFavoriteTicketsSelected) {
            setValue('favorite')
        } else if (isOwnTicketsSelected) {
            setValue('own')
        } else if (isAllTicketsSelected) {
            setValue('all')
        }
    }, [isAllTicketsSelected, isFavoriteTicketsSelected, isOwnTicketsSelected])

    const { data: allTicketsCountData, refetch: refetchAllTickets } = useGetTicketsCountQuery({
        variables: {
            where: ticketFilterQuery,
        },
    })
    const allTicketsCount = useMemo(() => allTicketsCountData?.meta?.count, [allTicketsCountData?.meta?.count])

    // NOTE: we have index "ticket_org_assign_exec_deletedAt" for this filter
    // If you change filter condition, you need to change index
    const { isRefetchTicketsFeatureEnabled, refetchInterval } = useAutoRefetchTickets()
    const refetch = useCallback(async () => {
        await refetchAllTickets()
    }, [refetchAllTickets])

    useEffect(() => {
        if (isRefetchTicketsFeatureEnabled) {
            const handler = setInterval(async () => {
                await refetch()
            }, refetchInterval)
            return () => {
                clearInterval(handler)
            }
        }
    }, [isRefetchTicketsFeatureEnabled, refetchInterval])

    const { logEvent } = useTracking()

    const handleRadioChange = useCallback(async (event) => {
        const value = event.target.value

        setValue(value)
        logEvent({ eventName: 'TicketTypeFilterTabChange', denyDuplicates: true, eventProperties: { tab: value } })

        let newFilters
        if (value === 'all') {
            newFilters = omit(filters, ['type'])
        } else if (value === 'own') {
            newFilters = {
                ...omit(filters, ['type']),
                type: 'own',
            }
        } else if (value === 'favorite') {
            newFilters = {
                ...omit(filters, ['type']),
                type: 'favorite',
            }
        }
        const newParameters = getFiltersQueryData(newFilters)
        await updateQuery(router, { newParameters }, { routerAction: 'replace', shallow: true })
    }, [filters, logEvent, router])

    return (
        <RadioGroup optionType='button' value={value} onChange={handleRadioChange}>
            <Radio
                key='all'
                value='all'
                label={
                    <>
                        {AllTicketsMessage}
                        {isNumber(allTicketsCount) && <sup>{allTicketsCount}</sup>}
                    </>
                }
            />
            <Radio
                key='own'
                value='own'
                label={
                    <>
                        {OwnTicketsMessage}
                    </>
                }
            />
        </RadioGroup>
    )
}

const TicketsPage: PageComponentType = () => {
    const intl = useIntl()
    const PageTitleMessage = intl.formatMessage({ id: 'pages.condo.ticket.index.PageTitle' })
    const { ticketFilterQuery, ticketFilterQueryLoading } = useTicketVisibility()

    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'])
    const employeeId = get(userOrganization, 'link.id')

    const filterMetas = useTicketTableFilters()

    const { GlobalHints } = useGlobalHints()
    const { breakpoints } = useLayoutContext()
    usePreviousSortAndFilters({ employeeSpecificKey: employeeId })

    const {
        error,
        data: ticketExistenceData,
        loading: ticketExistenceLoading,
    } = useGetTicketExistenceQuery({
        variables: {
            where: ticketFilterQuery,
        },
        fetchPolicy: 'network-only',
    })
    const isTicketsExists = useMemo(() => ticketExistenceData?.tickets?.length > 0,
        [ticketExistenceData?.tickets?.length])

    return (
        <>
            <Head>
                <title>{PageTitleMessage}</title>
            </Head>
            <PageWrapper>
                {GlobalHints}
                <AutoRefetchTicketsContextProvider>
                    <FavoriteTicketsContextProvider
                        extraTicketsQuery={{ ...ticketFilterQuery, organization: { id: userOrganizationId } }}
                    >
                        <WindowTitleContextProvider title={PageTitleMessage}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: breakpoints.TABLET_LARGE ? '40px' : '24px', height: '100%' }}>
                                <Row justify='space-between' align='middle' gutter={MEDIUM_VERTICAL_ROW_GUTTER}>
                                    <Col>
                                        <PageHeader
                                            style={HEADER_STYLES}
                                            title={
                                                <Typography.Title>
                                                    {PageTitleMessage}
                                                </Typography.Title>
                                            }
                                        />
                                    </Col>
                                    <Col>
                                        <Space size={20} direction={breakpoints.TABLET_SMALL ? 'horizontal' : 'vertical'}>
                                            {
                                                !ticketExistenceLoading && isTicketsExists && (
                                                    <TicketTypeFilterSwitch
                                                        ticketFilterQuery={ticketFilterQuery}
                                                    />
                                                )
                                            }
                                        </Space>
                                    </Col>
                                </Row>
                                <TablePageContent>
                                    <MultipleFilterContextProvider>
                                        <TicketsPageContent
                                            filterMetas={filterMetas}
                                            useTableColumns={useTableColumns}
                                            baseTicketsQuery={ticketFilterQuery}
                                            loading={ticketFilterQueryLoading || ticketExistenceLoading}
                                            sortableProperties={SORTABLE_PROPERTIES}
                                            showImport
                                            isTicketsExists={isTicketsExists}
                                            error={error}
                                        />
                                    </MultipleFilterContextProvider>
                                </TablePageContent>
                            </div>
                        </WindowTitleContextProvider>
                    </FavoriteTicketsContextProvider>
                </AutoRefetchTicketsContextProvider>
            </PageWrapper>
        </>
    )
}

TicketsPage.requiredAccess = TicketReadPermissionRequired

export default TicketsPage
