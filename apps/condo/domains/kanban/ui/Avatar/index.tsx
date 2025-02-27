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
    '#B38B7D',
    '#8FB37D', 
    '#7D8BB3',
    '#A37DB3', 
    '#B37D7D', 
    '#B37DA3',
    '#7DB3A3',
    '#7DA3B3', 
    '#D99666',
    '#66D996',
    '#9666D9',
    '#D9B366',
    '#B366D9',
    '#D9B3C6', 
    '#C6D9B3', 
    '#B3C6D9',
]
const getColorFromName = (name: string) => {
    const normalizedName = name.toLocaleLowerCase()
    const firstChar = normalizedName.charAt(0)
    const lastChar = normalizedName.charAt(normalizedName.length - 1)

    const charCodeSum = firstChar.charCodeAt(0) + lastChar.charCodeAt(0)
    return colors[charCodeSum % colors.length]
}

export default Avatar