import React from 'react'
import styled from 'styled-components'

import { font, mixin } from '../../styles'

const Image = styled.div<{ avatarUrl?: string, size: number }>`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 100%;
  ${props => mixin.backgroundImage(props.avatarUrl)}
`

export const Letter = styled.div<{ size?: number }>`
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 100%;
  text-transform: uppercase;
  color: #fff;
  background: ${props => props.color};
  ${props => font.size(Math.round(props.size / 1.7))}
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`

interface AvatarProps {
    className?: string
    avatarUrl?: string | null
    name: string
    size?: number
    [x: string]: any
}

const Avatar: React.FC<AvatarProps> = ({ className, avatarUrl, name, size = 32, ...otherProps }) => {
    const sharedProps = {
        className,
        size,
        ...otherProps,
    }

    if (avatarUrl) {
        return <Image avatarUrl={avatarUrl} {...sharedProps} />
    }

    return (
        <Letter color={getColorFromName(name)} {...sharedProps}>
            <span>{name.charAt(0)}</span>
        </Letter>
    )
}

const colors = [
    '#DA7657',
    '#6ADA57',
    '#5784DA',
    '#AA57DA',
    '#DA5757',
    '#DA5792',
    '#57DACA',
    '#57A5DA',
]

const getColorFromName = (name: string) => colors[name.toLocaleLowerCase().charCodeAt(0) % colors.length]

export default Avatar