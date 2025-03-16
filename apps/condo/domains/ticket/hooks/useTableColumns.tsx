import { useGetTicketStatusesQuery, useGetUserTicketCommentsReadTimeQuery } from '@app/condo/gql'
import { Ticket as ITicket, Property as IProperty } from '@app/condo/schema'
import { ColumnsType } from 'antd/lib/table'
import { ColumnType } from 'antd/lib/table/interface'
import get from 'lodash/get'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'

import { useCachePersistor } from '@open-condo/apollo'
import { useAuth } from '@open-condo/next/auth'
import { useIntl } from '@open-condo/next/intl'

import { useLayoutContext } from '@condo/domains/common/components/LayoutContext'
import { getOptionFilterDropdown, getFilterIcon } from '@condo/domains/common/components/Table/Filters'
import {
    getAddressRender,
    getDateRender,
    getTableCellRenderer,
} from '@condo/domains/common/components/Table/Renders'
import { FiltersMeta, getFilterDropdownByKey } from '@condo/domains/common/utils/filters.utils'
import { getFilteredValue } from '@condo/domains/common/utils/helpers'
import { getSorterMap, parseQuery } from '@condo/domains/common/utils/tables.utils'
import { useAutoRefetchTickets } from '@condo/domains/ticket/contexts/AutoRefetchTicketsContext'
import {
    getClassifierRender, getCommentsIndicatorRender,
    getStatusRender,
    getTicketDetailsRender,
    getTicketNumberRender,
    getUnitRender,
    getPriorityRender,
    getTypeRender,
} from '@condo/domains/ticket/utils/clientSchema/Renders'
import { IFilters } from '@condo/domains/ticket/utils/helpers'


const COLUMNS_WIDTH = {
    commentsIndicator: '0%',
    number: '10%',
    type: '10%',
    status: '12%',
    priority: '12%',
    details: '23%', 
    executor: '17%', 
    assignee: '17%',
    address: '14%',
    unitName: '8%',
    categoryClassifier: '12%',
    clientName: '10%',
}

export function useTableColumns<T> (
    filterMetas: Array<FiltersMeta<T>>,
    tickets: ITicket[],
    refetchTickets: () => Promise<undefined>,
    isRefetching: boolean,
    setIsRefetching: Dispatch<SetStateAction<boolean>>,
): { columns: ColumnsType<ITicket>,  loading: boolean } {
    const intl = useIntl()
    const NumberMessage = intl.formatMessage({ id: 'ticketsTable.Number' })
    const TypeMessage = intl.formatMessage({ id: 'global.type' })
    const StatusMessage = intl.formatMessage({ id: 'Status' })
    const PriorityMessage = intl.formatMessage({ id: 'kanban.ticket.priority.title' })
    const ClientNameMessage = intl.formatMessage({ id: 'Contact' })
    const DescriptionMessage = intl.formatMessage({ id: 'Title' })
    const AddressMessage = intl.formatMessage({ id: 'field.Address' })
    const ExecutorMessage = intl.formatMessage({ id: 'field.Executor' })
    const ResponsibleMessage = intl.formatMessage({ id: 'field.Responsible' })
    const DeletedMessage = intl.formatMessage({ id: 'Deleted' })
    const ClassifierTitle = intl.formatMessage({ id: 'Classifier' })
    const UnitMessage = intl.formatMessage({ id: 'field.UnitName' })

    const router = useRouter()
    const { filters, sorters } = parseQuery(router.query)
    const sorterMap = getSorterMap(sorters)
    const search = getFilteredValue(filters, 'search')
    const { breakpoints } = useLayoutContext()

    const {
        loading: statusesLoading,
        data: ticketStatusesData,
    } = useGetTicketStatusesQuery()
    const ticketStatuses = useMemo(() => ticketStatusesData?.statuses?.filter(Boolean) || [], [ticketStatusesData?.statuses])

    const renderStatusFilterDropdown: ColumnType<ITicket>['filterDropdown'] = useCallback((filterProps) => {
        const adaptedStatuses = ticketStatuses?.map(status => ({ label: status.name, value: status.type })).filter(identity)
        return getOptionFilterDropdown({
            checkboxGroupProps: {
                options: adaptedStatuses,
                disabled: statusesLoading,
                id: 'statusFilterDropdown',
            },
        })(filterProps)
    }, [statusesLoading, ticketStatuses])

    const renderAddress = useCallback(
        (property: IProperty, ticket: ITicket) => {
            const propertyData = property || { addressMeta: get(ticket, 'propertyAddressMeta'), address: get(ticket, 'propertyAddress'), deletedAt: 'true' }
            return getAddressRender(propertyData, DeletedMessage, search)
        },
        [DeletedMessage, search])
        

    const renderExecutor = useCallback(
        (executor) => getTableCellRenderer({ search })(get(executor, ['name'])),
        [search])

    const renderAssignee = useCallback(
        (assignee) => getTableCellRenderer({ search })(get(assignee, ['name'])),
        [search])

    const { user } = useAuth()
    const { persistor } = useCachePersistor()

    const ticketIds = useMemo(() => map(tickets, 'id'), [tickets])
    const userId = useMemo(() => user?.id, [user?.id])
    const {
        data: userTicketCommentReadTimesData,
        refetch: refetchUserTicketCommentReadTimes,
        loading: userTicketCommentReadTimesLoading,
    } = useGetUserTicketCommentsReadTimeQuery({
        variables: {
            userId,
            ticketIds,
        },
        skip: !persistor || !userId || isEmpty(ticketIds),
    })
    const userTicketCommentReadTimes = useMemo(() => userTicketCommentReadTimesData?.objs?.filter(Boolean) || [],
        [userTicketCommentReadTimesData?.objs])

    const { isRefetchTicketsFeatureEnabled, refetchInterval } = useAutoRefetchTickets()

    const refetch = useCallback(async () => {
        await refetchTickets()
        await refetchUserTicketCommentReadTimes()
    }, [refetchTickets, refetchUserTicketCommentReadTimes])

    useEffect(() => {
        if (isRefetchTicketsFeatureEnabled) {
            const handler = setInterval(async () => {
                setIsRefetching(true)
                await refetch()
                setIsRefetching(false)
            }, refetchInterval)
            return () => {
                clearInterval(handler)
            }
        }
    }, [isRefetchTicketsFeatureEnabled, refetch, refetchInterval, setIsRefetching])

    return useMemo(() => ({
        columns: [
            {
                key: 'commentsIndicator',
                width: COLUMNS_WIDTH.commentsIndicator,
                render: getCommentsIndicatorRender({
                    intl, userTicketCommentReadTimes, breakpoints,
                }),
                align: 'center',
                className: 'comments-column',
            },
            {
                title: NumberMessage,
                sortOrder: get(sorterMap, 'number'),
                filteredValue: getFilteredValue<IFilters>(filters, 'number'),
                dataIndex: 'number',
                key: 'number',
                sorter: true,
                width: COLUMNS_WIDTH.number,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'number'),
                filterIcon: getFilterIcon,
                render: getTicketNumberRender(intl, search),
                align: 'center',
                className: 'number-column',
            },
            {
                title: TypeMessage,
                filteredValue: getFilteredValue<IFilters>(filters, 'customClassifier'),
                dataIndex: 'customClassifier',
                key: 'customClassifier',
                width: COLUMNS_WIDTH.type,
                render: getTypeRender(intl, search),
                align: 'center',
            },
            {
                title: StatusMessage,
                sortOrder: get(sorterMap, 'status'),
                filteredValue: getFilteredValue<IFilters>(filters, 'status'),
                render: getStatusRender(intl, search),
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                width: COLUMNS_WIDTH.status,
                filterDropdown: renderStatusFilterDropdown,
                filterIcon: getFilterIcon,
            },
            {
                title: PriorityMessage,
                sortOrder: get(sorterMap, 'priority'),
                filteredValue: getFilteredValue<IFilters>(filters, 'priority'),
                render: getPriorityRender(intl, search),
                dataIndex: 'priority',
                key: 'priority',
                sorter: true,
                width: COLUMNS_WIDTH.priority,
                filterIcon: getFilterIcon,
                align: 'center',
            },
            {
                title: DescriptionMessage,
                dataIndex: 'title',
                filteredValue: getFilteredValue<IFilters>(filters, 'details'),
                key: 'details',
                width: COLUMNS_WIDTH.details,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'details'),
                filterIcon: getFilterIcon,
                render: getTicketDetailsRender(search),
            },
            {
                title: ExecutorMessage,
                sortOrder: get(sorterMap, 'executor'),
                filteredValue: getFilteredValue<IFilters>(filters, 'executor'),
                dataIndex: 'executor',
                key: 'executor',
                sorter: true,
                width: COLUMNS_WIDTH.executor,
                render: renderExecutor,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'executor'),
                filterIcon: getFilterIcon,
                ellipsis: true,
            },
            {
                title: ResponsibleMessage,
                sortOrder: get(sorterMap, 'assignee'),
                filteredValue: getFilteredValue<IFilters>(filters, 'assignee'),
                dataIndex: 'assignee',
                key: 'assignee',
                sorter: true,
                width: COLUMNS_WIDTH.assignee,
                render: renderAssignee,
                filterDropdown: getFilterDropdownByKey(filterMetas, 'assignee'),
                filterIcon: getFilterIcon,
                ellipsis: true,
            },
        ],
        loading: userTicketCommentReadTimesLoading,
    }), [intl, userTicketCommentReadTimes, breakpoints, NumberMessage, sorterMap, filters, filterMetas, search, TypeMessage, StatusMessage, renderStatusFilterDropdown, AddressMessage, renderAddress, UnitMessage, DescriptionMessage, ClassifierTitle, ClientNameMessage, ExecutorMessage, renderExecutor, ResponsibleMessage, renderAssignee, userTicketCommentReadTimesLoading])
}

export function useTicketQualityTableColumns (): { columns: ColumnsType<ITicket> } {
    const intl = useIntl()
    const NumberMessage = intl.formatMessage({ id: 'ticketsTable.Number' })
    const DateMessage = intl.formatMessage({ id: 'Date' })
    const DescriptionMessage = intl.formatMessage({ id: 'Description' })
    const AddressMessage = intl.formatMessage({ id: 'field.Address' })
    const DeletedMessage = intl.formatMessage({ id: 'Deleted' })
    const ClassifierTitle = intl.formatMessage({ id: 'Classifier' })
    const UnitMessage = intl.formatMessage({ id: 'field.UnitName' })
    const FeedbackMessage = intl.formatMessage({ id: 'ticket.feedback' })

    const router = useRouter()
    const { filters } = parseQuery(router.query)
    const search = getFilteredValue(filters, 'search')

    const renderAddress = useCallback(
        (property) => getAddressRender(property, DeletedMessage, search),
        [DeletedMessage, search])

    const renderFeedback = (intl) => {
        return function render (feedback: string, ticket: ITicket) {
            return intl.formatMessage({ id: `ticket.feedback.${ticket.feedbackValue || feedback}` })
        }
    }

    return useMemo(() => ({
        columns: [
            {
                title: NumberMessage,
                dataIndex: 'number',
                key: 'number',
                sorter: true,
                width: COLUMNS_WIDTH.number,
                render: getTicketNumberRender(intl, search),
                align: 'left',
                className: 'number-column',
            },
            {
                title: DateMessage,
                filteredValue: getFilteredValue<IFilters>(filters, 'createdAt'),
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: true,
                width: COLUMNS_WIDTH.type,
                render: getDateRender(intl, String(search)),
            },
            {
                title: AddressMessage,
                dataIndex: 'property',
                filteredValue: getFilteredValue<IFilters>(filters, 'property'),
                key: 'property',
                sorter: true,
                width: COLUMNS_WIDTH.address,
                render: renderAddress,
            },
            {
                title: UnitMessage,
                dataIndex: 'unitName',
                filteredValue: getFilteredValue(filters, 'unitName'),
                key: 'unitName',
                sorter: true,
                width: COLUMNS_WIDTH.unitName,
                render: getUnitRender(intl, search),
                ellipsis: true,
            },
            {
                title: DescriptionMessage,
                dataIndex: 'details',
                filteredValue: getFilteredValue<IFilters>(filters, 'details'),
                key: 'details',
                width: COLUMNS_WIDTH.details,
                render: getTicketDetailsRender(search),
            },
            {
                title: ClassifierTitle,
                dataIndex: ['classifier', 'category', 'name'],
                filteredValue: getFilteredValue(filters, 'categoryClassifier'),
                key: 'categoryClassifier',
                width: COLUMNS_WIDTH.categoryClassifier,
                render: getClassifierRender(intl, search),
                ellipsis: true,
            },
            {
                title: FeedbackMessage,
                dataIndex: 'qualityControlValue',
                key: 'qualityControlValue',
                width: '10%',
                render: renderFeedback(intl),
            },
        ],
    }), [AddressMessage, ClassifierTitle, DateMessage, DescriptionMessage, FeedbackMessage,
        NumberMessage, UnitMessage, filters, intl, renderAddress, search])
}
