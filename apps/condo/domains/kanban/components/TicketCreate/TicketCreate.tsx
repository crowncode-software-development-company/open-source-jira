/* eslint-disable react/display-name */
import { DownOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { CSSProperties, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Close } from '@open-condo/icons'
import { useAuth } from '@open-condo/next/auth'
import { useOrganization } from '@open-condo/next/organization'

import { ActionButton, Actions, Divider, HelpText, LabelText, SelectItem, SelectItemLabel, Title, TopActions } from './Styles'

import LoadingOrErrorPage from '../../../common/components/containers/LoadingOrErrorPage'
import DatePicker from '../../../common/components/Pickers/DatePicker'
import { OrganizationEmployee } from '../../../organization/utils/clientSchema'
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

const ProjectTicketCreate = ({ closeModal }) => {
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
    const [form] = Form.useForm()
    const { query } = useRouter()
    const { organization } = useOrganization()
    const { user } = useAuth()

    const { objs: employeesData, loading: employeesLoading } = OrganizationEmployee.useAllObjects({
        where: {
            organization: { id: organization.id },
            user: { deletedAt: null },
            deletedAt: null,
            isBlocked: false,
            isRejected: false,
        },
    })
    const employees = useMemo(() => employeesData?.filter(Boolean) || [], [employeesData])
    const employeeOptions = employees.map(employee => ({ value: employee.user.id, label: employee.user.name }))
    const getEmployeeById = employeeId => employees.find(employee => employee.user.id === employeeId)

    useEffect(() => {
        form.resetFields()
    },
    [query['create-modal']])

    const initialValues = {
        assignee: user.id,
        deadline: dayjs().add(7, 'day'),
        priority: TicketPriority.MEDIUM,
    }

    const onFinish = (values) => {
        console.log('Received values:', values)
        closeModal()
        form.resetFields()
    }

    if (employeesLoading) { 
        return <LoadingOrErrorPage loading={employeesLoading} />
    }

    return (
        <>
            <TopActions>
                <Title>{CreateTicketTitle}</Title>
                <Button icon={<Close/>} iconSize={24} variant='empty' onClick={closeModal} />
            </TopActions>
       
            <Form form={form} layout='vertical' onFinish={onFinish} initialValues={initialValues}>

                <CustomFormItem label={TypeTitle} name='type' help={TypeHelp} rules={[{ required: true }]}>
                    <Select
                        placeholder={SelectTitle}
                        withClearValue={false}
                        value={form.getFieldValue('type')}
                        onChange={(value) => form.setFieldsValue({ type: value })}
                        name='type'
                        options={typeOptions}
                        renderOption={renderType}
                        renderValue={renderType}
                    />
                </CustomFormItem>

                <Divider />

                <CustomFormItem label={TitleTitle} name='title' help={TitleHelp} rules={[{ required: true }, { max: 70, message: 'Maximum length is 70 characters.' }]}>
                    <Input
                        value={form.getFieldValue('title')}
                        onChange={(value) => form.setFieldsValue({ title: value })}
                        name='title'
                    />
                </CustomFormItem>

                <CustomFormItem label={DescriptionTitle} name='description' help={DescriptionHelp} rules={[{ required: true }]}>
                    <TextEditor 
                        action='create'
                        value={form.getFieldValue('description')}
                        onChange={(value) => form.setFieldsValue({ description: value })}
                    />
                </CustomFormItem>

                <CustomFormItem label={PriorityTitle} name='priority' help={ExecutorHelp} rules={[{ required: true }]}>
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

                <CustomFormItem label={AssigneeTitle} name='assignee' help={AssigneeHelp} rules={[{ required: true }]}>
                    <Select
                        placeholder={SelectTitle}
                        withClearValue={false}
                        value={form.getFieldValue('assignee')}
                        onChange={(value) => form.setFieldsValue({ assignee: value })}
                        name='assignee'
                        options={employeeOptions}
                        renderOption={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
                        renderValue={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
                    />
                </CustomFormItem>

                <CustomFormItem label={ExecutorTitle} name='executor' help={PriorityHelp} rules={[{ required: true }]}>
                    <Select
                        placeholder={SelectTitle}
                        withClearValue={false}
                        value={form.getFieldValue('executor')}
                        onChange={(value) => form.setFieldsValue({ executor: value })}
                        name='executor'
                        options={employeeOptions}
                        renderOption={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
                        renderValue={({ value: employeeId }) => renderUser(getEmployeeById(employeeId))}
                    />
                </CustomFormItem>

                <CustomFormItem label={DeadlineTitle} name='deadline' help={DeadlineHelp} rules={[{ required: true }]}>
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

export const renderUser = (user) => {
    return (
        <SelectItem key={user.id}>
            <Avatar size={20} name={user.name}/>
            <SelectItemLabel>{user.name}</SelectItemLabel>
        </SelectItem>
    )
}
  
const CustomFormItem = ({ label, name, help = '', children, ...props }) => {
    return (
        <Form.Item 
            label={<LabelText>{label}</LabelText>} 
            name={name}
            help={<HelpText>{help}</HelpText>}
            style={{ marginBottom: '-20px' }}
            {...props}
        >
            {children}
        </Form.Item>
    )
}

export default ProjectTicketCreate
