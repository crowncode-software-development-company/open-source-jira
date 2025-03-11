import { DownOutlined } from '@ant-design/icons'
import { Form, notification } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { Close } from '@open-condo/icons'
import { useAuth } from '@open-condo/next/auth'
import { useOrganization } from '@open-condo/next/organization'

import { Ticket } from '@condo/domains/ticket/utils/clientSchema'

import { ActionButton, Actions, Divider, HelpText, LabelText, SelectItem, SelectItemLabel, Title, TopActions } from './Styles'

import LoadingOrErrorPage from '../../../common/components/containers/LoadingOrErrorPage'
import DatePicker from '../../../common/components/Pickers/DatePicker'
import { useValidations } from '../../../common/hooks/useValidations'
import { getClientSideSenderInfo } from '../../../common/utils/userid.utils'
import { OrganizationEmployee } from '../../../organization/utils/clientSchema'
import { PropertyTable } from '../../../property/utils/clientSchema'
import { TicketPriority, TicketPriorityCopy, TicketType, TicketTypeCopy } from '../../constants'
import { color } from '../../styles'
import { Avatar, Button, Input, Select, TextEditor, TicketPriorityIcon, TicketTypeIcon } from '../../ui'

const typeOptions = Object.values(TicketType).map(type => ({
    value: type,
    label: TicketTypeCopy[type],
}))

const priorityOptions = Object.values(TicketPriority).map(priority => ({
    value: priority,
    label: TicketPriorityCopy[priority],
}))

const INPUT_STYLE: CSSProperties = { width: '100%', height: '36px', borderRadius: '5px', backgroundColor: color.backgroundLightest }
const OPEN_STATUS = '6ef3abc4-022f-481b-90fb-8430345ebfc2'
const DEFAULT_TICKET_SOURCE_CALL_ID = '779d7bb6-b194-4d2c-a967-1f7321b2787f'

const ProjectTicketCreate = ({ ticketsCount, closeModal, refetchTicketsBoard }) => {
    const intl = useIntl()
    const CreateTicketTitle = intl.formatMessage({ id: 'CreateTicket' })
    const CancelTitle = intl.formatMessage({ id: 'Cancel' })
    const SelectTitle = intl.formatMessage({ id: 'Select' })
    const TypeTitle = intl.formatMessage({ id: 'pages.condo.ticket.field.Type' })
    const TitleTitle = intl.formatMessage({ id: 'Title' })
    const DescriptionTitle = intl.formatMessage({ id: 'Description' })
    const PriorityTitle = intl.formatMessage({ id: 'kanban.ticket.priority.title' })
    const AssigneeTitle = intl.formatMessage({ id: 'field.Responsible' })
    const ExecutorTitle = intl.formatMessage({ id: 'field.Executor' })
    const DeadlineTitle = intl.formatMessage({ id: 'kanban.ticket.deadline.title' })
    const TypeHelp = intl.formatMessage({ id: 'kanban.create.type.help' })
    const TitleHelp = intl.formatMessage({ id: 'kanban.create.title.help' })
    const DescriptionHelp = intl.formatMessage({ id: 'kanban.create.description.help' })
    const PriorityHelp = intl.formatMessage({ id: 'kanban.create.priority.help' })
    const AssigneeHelp = intl.formatMessage({ id: 'kanban.create.assignee.help' })
    const ExecutorHelp = intl.formatMessage({ id: 'kanban.create.executor.help' })
    const DeadlineHelp = intl.formatMessage({ id: 'kanban.create.deadline.help' })
    const SuccessNotification = intl.formatMessage({ id: 'tour.step.createTicket.completed.title' })
    const ErrorNotification = intl.formatMessage({ id: 'ErrorOccurred' })
    const [isCreating, setIsCreating] = useState(false)
    const [form] = Form.useForm()
    const { query } = useRouter()
    const { organization } = useOrganization()
    const { user } = useAuth()
    const { requiredValidator, maxLengthValidator, minLengthValidator } = useValidations()
    const { objs: employeesData, loading: employeesLoading, error: employeesError } = OrganizationEmployee.useAllObjects({
        where: {
            organization: { id: organization.id },
            user: { deletedAt: null },
            deletedAt: null,
            isBlocked: false,
            isRejected: false,
        },
    })
    const users = useMemo(() => {
        return employeesData?.filter(Boolean).map(employee => ({
            name: employee.user?.name || '',
            id: employee.user?.id || '',
        })) || []
    }, [employeesData])
    
    const usersOptions = users.map(user => ({ value: user.id, label: user.name }))
    const getUserById = userId => users.find(user => user.id === userId)

    useEffect(() => {
        form.resetFields()
    },
    [query['create-modal']])

    const initialValues = {
        deadline: dayjs().add(7, 'day'),
        details: ' ',
        priority: TicketPriority.MEDIUM,
    }

    const validations = {
        title: [requiredValidator, minLengthValidator(10), maxLengthValidator(70)],
        description: [maxLengthValidator(3000)],
        type: [requiredValidator],
    }

    const createTicketAction = Ticket.useCreate({
        sender: getClientSideSenderInfo(),
        status: { connect: { id: OPEN_STATUS } },
        source: { connect: { id: DEFAULT_TICKET_SOURCE_CALL_ID } },
        kanbanOrder: ticketsCount * 10000000,
    })

    const { loading: propertyLoading, error: propertyError, objs: properties } = PropertyTable.useObjects({ where: { organization: { id: organization.id } } })
    const randomPropertyId = properties[0]?.id

    const onFinish = async (values) => {
        setIsCreating(true)
        try {
            await createTicketAction({
                ...values,
                property: { connect: { id: randomPropertyId } },
                ...(values.assignee && { assignee: { connect: { id: values.assignee } } }),
                ...(values.executor && { executor: { connect: { id: values.executor } } }),
                organization: { connect: { id: organization.id } },
            })
            notification.success({ message: SuccessNotification })
            refetchTicketsBoard()
            closeModal()
            form.resetFields()
        } catch { 
            notification.error({ message: ErrorNotification })
        } finally {
            setIsCreating(false)
        }
    }

    if (employeesLoading || propertyLoading) { 
        return <LoadingOrErrorPage
            loading={employeesLoading || propertyLoading}
            error={propertyError || employeesError} />
    }

    return (
        <>
            <TopActions>
                {console.log(properties)
                }
                <Title>{CreateTicketTitle}</Title>
                <Button icon={<Close/>} iconSize={24} variant='empty' onClick={closeModal} />
            </TopActions>
       
            <Form disabled={isCreating} form={form} layout='vertical' onFinish={onFinish} initialValues={initialValues}>

                <CustomFormItem label={TypeTitle} name='customClassifier' helpText={TypeHelp} rules={validations.type}>
                    <Select
                        placeholder={SelectTitle}
                        withClearValue={false}
                        value={form.getFieldValue('customClassifier')}
                        onChange={(value) => form.setFieldsValue({ customClassifier: value })}
                        name='customClassifier'
                        options={typeOptions}
                        renderOption={renderType}
                        renderValue={renderType}
                    />
                </CustomFormItem>

                <Divider />

                <CustomFormItem label={TitleTitle} name='title' helpText={TitleHelp} rules={validations.title}>
                    <Input
                        value={form.getFieldValue('title')}
                        onChange={(value) => form.setFieldsValue({ title: value })}
                        name='title'
                    />
                </CustomFormItem>

                <CustomFormItem label={DescriptionTitle} name='details' helpText={DescriptionHelp} rules={validations.description}>
                    <TextEditor 
                        action='create'
                        value={form.getFieldValue('details')}
                        onChange={(value) => form.setFieldsValue({ details: value })}
                    />
                </CustomFormItem>

                <CustomFormItem label={PriorityTitle} name='priority' helpText={PriorityHelp}>
                    <Select
                        placeholder={SelectTitle}
                        withClearValue={false}
                        value={form.getFieldValue('priority')}
                        onChange={(value) => form.setFieldsValue({ priority: value })}
                        name='priority'
                        options={priorityOptions}
                        renderOption={renderPriority}
                        renderValue={renderPriority}
                    />
                </CustomFormItem>

                <CustomFormItem label={AssigneeTitle} name='assignee' helpText={AssigneeHelp}>
                    <Select
                        placeholder={SelectTitle}
                        value={form.getFieldValue('assignee')}
                        onChange={(value) => form.setFieldsValue({ assignee: value })}
                        options={usersOptions}
                        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
                        renderValue={({ value: userId, removeOptionValue }) => renderUser(getUserById(userId), removeOptionValue)}
                    />
                </CustomFormItem>

                <CustomFormItem label={ExecutorTitle} name='executor' helpText={ExecutorHelp}>
                    <Select
                        placeholder={SelectTitle}
                        value={form.getFieldValue('executor')}
                        onChange={(value) => form.setFieldsValue({ executor: value })}
                        options={usersOptions}
                        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
                        renderValue={({ value: userId, removeOptionValue }) => renderUser(getUserById(userId), removeOptionValue)}
                    />
                </CustomFormItem>

                <CustomFormItem label={DeadlineTitle} name='deadline' helpText={DeadlineHelp}>
                    <DatePicker
                        value={form.getFieldValue('deadline')}
                        onChange={(value) => form.setFieldsValue({ deadline: value })}
                        format='DD.MM.YYYY'
                        style={INPUT_STYLE}
                        disabledDate={(date) => date <= dayjs()}
                        clearIcon={false}
                        suffixIcon={<DownOutlined />}
                    />
                </CustomFormItem>

                <Actions>
                    <ActionButton type='submit' variant='primary'>{CreateTicketTitle}</ActionButton>
                    <ActionButton type='button' variant='empty' onClick={closeModal}>{CancelTitle}</ActionButton>
                </Actions>
            </Form>
        </>
    )
}

export const renderType = ({ value: type }) => (
    <SelectItem>
        <TicketTypeIcon type={type} size='medium'/>
        <SelectItemLabel>{TicketTypeCopy[type]}</SelectItemLabel>
    </SelectItem>
)

export const renderPriority = ({ value: priority }) => (
    <SelectItem>
        <TicketPriorityIcon priority={priority} size='medium' />
        <SelectItemLabel>{TicketPriorityCopy[priority]}</SelectItemLabel>
    </SelectItem>
)

export const renderUser = (user, removeOptionValue?) => {
    return (
        <SelectItem key={user.id} onClick={() => removeOptionValue?.()}>
            <Avatar size={20} name={user.name}/>
            <SelectItemLabel>{user.name}</SelectItemLabel>
        </SelectItem>
    )
}
  
const CustomFormItem = ({ label, name, helpText, children, ...props }) => {
    return (
        <Form.Item 
            label={<LabelText>{label}</LabelText>} 
            name={name}
            help={<HelpText>{props.errors && props.errors[name] ? props.errors[name].message : helpText}</HelpText>}
            style={{ marginBottom: '-20px' }}   
            {...props}
        >
            {children}
        </Form.Item>
    )
}

export default ProjectTicketCreate
