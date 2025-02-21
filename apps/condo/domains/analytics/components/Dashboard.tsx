import { Row, Col, Skeleton } from 'antd'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import React, { useEffect, useMemo, useState, useRef } from 'react'

import { LayoutList } from '@open-condo/icons'
import { useLazyQuery } from '@open-condo/next/apollo'
import { useIntl } from '@open-condo/next/intl'
import { Card, Typography, Space } from '@open-condo/ui'

import {
    TicketByExecutorChart,
    AllTicketsChart,
} from '@condo/domains/analytics/components/charts'
import { GET_OVERVIEW_DASHBOARD_MUTATION } from '@condo/domains/analytics/gql'
import { usePropertyFilter, useDateRangeFilter } from '@condo/domains/analytics/hooks/useDashboardFilters'
import { useLayoutContext } from '@condo/domains/common/components/LayoutContext'
import { TableFiltersContainer } from '@condo/domains/common/components/TableFiltersContainer'
import { useWindowSize } from '@condo/domains/common/hooks/useWindowSize'
import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { GET_TICKETS_COUNT_QUERY } from '@condo/domains/ticket/utils/clientSchema/search'

import type { OverviewData } from '@app/condo/schema'
import type { RowProps } from 'antd'

const DASHBOARD_ROW_GUTTER: RowProps['gutter'] = [20, 40]
const CARD_ROW_GUTTER: RowProps['gutter'] = [8, 24]
const DATA_CARD_DESCRIPTION_CONTAINER_STYLE: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
}
const DASHBOARD_WIDTH_BREAKPOINT = 1300

type StatisticCardProps = { label: string, value: string | number, secondaryLabel?: string }

const StatisticCard: React.FC<StatisticCardProps> = ({ label, value, secondaryLabel }) => (
    <Col>
        <Space direction='vertical' align='center' size={8}>
            <Typography.Title level={3} type='primary'>{value}</Typography.Title>
            <div style={DATA_CARD_DESCRIPTION_CONTAINER_STYLE}>
                <Typography.Text type='primary'>{label}</Typography.Text>
                {secondaryLabel && (
                    <Typography.Text type='secondary' size='small'>{secondaryLabel}</Typography.Text>
                )}
            </div>
        </Space>
    </Col>
)

const PerformanceCard = ({ organizationId, paymentSum, propertyData, residentsData, loading, dateRange, propertyIds }) => {
    const intl = useIntl()
    const SummaryTitle = intl.formatMessage({ id: 'pages.reports.summary' })
    const DoneLabel = intl.formatMessage({ id: 'Done' })
    const InWorkLabel = intl.formatMessage({ id: 'ticket.status.IN_PROGRESS.name' })
    const NewTicketsLabel = intl.formatMessage({ id: 'ticket.status.OPEN.many' })
    const CompletedLabel = intl.formatMessage({ id: 'ticket.status.COMPLETED.many' })
    const ClosedTicketsLabel = intl.formatMessage({ id: 'ticket.status.CLOSED.many' })

    const { breakpoints } = useLayoutContext()

    const [completionPercent, setCompletionPercent] = useState('—')
    const [residentsCount, setResidentsCount] = useState(0)
    const ticketCounts = useRef(null)

    const [loadTicketCounts, { loading: ticketCountLoading }] = useLazyQuery(GET_TICKETS_COUNT_QUERY, {
        onCompleted: (result) => {
            ticketCounts.current = result
            if (result.all.count > 0) {
                const doneTickets = result.completed.count + result.closed.count
                setCompletionPercent((doneTickets / result.all.count * 100).toFixed(0) + '%')
            } else {
                setCompletionPercent('—')
            }
        },
        fetchPolicy: 'network-only',
    })

    useEffect(() => {
        const ticketWhere = {
            organization: { id: organizationId },
            createdAt_gte: dateRange[0].startOf('day').toISOString(),
            createdAt_lte: dateRange[1].endOf('day').toISOString(),
        }

        if (!isEmpty(propertyIds)) {
            ticketWhere['property'] = { id_in: propertyIds }
        }

        loadTicketCounts({ variables: { where: ticketWhere, whereWithoutStatuses: ticketWhere } })
    }, [organizationId, loadTicketCounts, dateRange, propertyIds])

    useEffect(() => {
        if (residentsData.length) {
            setResidentsCount(residentsData.reduce((p, c) => p + Number(c.count), 0))
        } else {
            setResidentsCount(0)
        }
    }, [residentsData])
    const iconStyle = useMemo(() => ({ display: !breakpoints.TABLET_LARGE ? 'none' : 'block' }), [breakpoints.TABLET_LARGE])
    const cardRowJustify = useMemo(() => breakpoints.TABLET_LARGE ? 'space-between' : 'space-around', [breakpoints.TABLET_LARGE])

    const isTicketCountLoading = ticketCountLoading || isNull(ticketCounts.current)

    return (
        <Card title={<Typography.Title level={3}>{SummaryTitle}</Typography.Title>}>
            {isTicketCountLoading || loading ? (
                <Skeleton loading active paragraph={{ rows: 3 }} />
            ) : (
                <Row gutter={DASHBOARD_ROW_GUTTER}>
                    <Col span={24}>
                        <Row align='middle' justify={cardRowJustify} gutter={CARD_ROW_GUTTER}>
                            <Col style={iconStyle}>
                                <LayoutList />
                            </Col>
                            <StatisticCard
                                label={DoneLabel}
                                value={completionPercent}
                            />
                            <StatisticCard
                                label={NewTicketsLabel}
                                value={ticketCounts.current.new_or_reopened.count}
                            />
                            <StatisticCard
                                label={InWorkLabel}
                                value={ticketCounts.current.processing.count}
                            />
                            <StatisticCard
                                label={CompletedLabel}
                                value={ticketCounts.current.completed.count}
                            />
                            <StatisticCard
                                label={ClosedTicketsLabel}
                                value={ticketCounts.current.closed.count}
                            />
                        </Row>
                    </Col>
                </Row>
            )}
        </Card>
    )
}

export const Dashboard: React.FC<{ organizationId: string }> = ({ organizationId }) => {
    const [overview, setOverview] = useState<OverviewData>(null)
    const { dateRange, SearchInput: DateRangeSearch } = useDateRangeFilter()
    const { values: propertyIds, SearchInput: OrganizationPropertySearch } = usePropertyFilter({ organizationId })

    const { breakpoints: { TABLET_LARGE } } = useLayoutContext()
    const { width } = useWindowSize()

    const [loadDashboardData, { loading }] = useLazyQuery(GET_OVERVIEW_DASHBOARD_MUTATION, {
        onCompleted: (response) => {
            const { result } = response
            setOverview(result.overview)
        },
        onError: error => {console.log(error)},
    })

    useEffect(() => {
        loadDashboardData({ variables: {
            data: { dv: 1, sender: getClientSideSenderInfo(),
                where: {
                    organization: organizationId,
                    dateFrom: dateRange[0].toISOString(),
                    dateTo: dateRange[1].toISOString(),
                    propertyIds,
                },
                groupBy: {
                    aggregatePeriod: 'day',
                },
            },
        } })
    }, [organizationId, loadDashboardData, dateRange, propertyIds])

    const newTickets = get(overview, 'ticketByDay.tickets', [])
    const executorTickets = get(overview, 'ticketByExecutor.tickets', [])
    const propertyData = get(overview, 'property.sum', 0)
    const paymentSum = get(overview, 'payment.sum', null)
    const residentsData = get(overview, 'resident.residents', [])

    return (
        <Row gutter={DASHBOARD_ROW_GUTTER}>
            <Col span={24}>
                <TableFiltersContainer>
                    <Row gutter={[24, 24]} align='middle' justify='start' wrap>
                        <Col span={TABLET_LARGE ? 24 : 48}>
                            <DateRangeSearch disabled={loading} />
                        </Col>
                    </Row>
                </TableFiltersContainer>
            </Col>
            <Col xl={width > DASHBOARD_WIDTH_BREAKPOINT ? 24 : 48} lg={24}>
                <PerformanceCard
                    organizationId={organizationId}
                    paymentSum={paymentSum}
                    residentsData={residentsData}
                    propertyIds={propertyIds}
                    propertyData={propertyData}
                    loading={loading}
                    dateRange={dateRange}
                />
            </Col>
            {overview === null ? (
                <Skeleton paragraph={{ rows: 62 }} loading active />
            ) : (
                <Col span={24}>
                    <Row gutter={DASHBOARD_ROW_GUTTER}>
                        <Col lg={12} md={24} xs={24}>
                            <AllTicketsChart
                                data={newTickets}
                            />
                        </Col>
                        <Col lg={12} md={24} xs={24}>
                            <TicketByExecutorChart
                                data={executorTickets}
                                organizationId={organizationId}
                            />
                        </Col>
                    </Row>
                </Col>
            )}
        </Row>
    )
}
