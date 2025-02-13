import { css } from 'styled-components'

import { IssuePriority } from './constants'

export const color = {
    primary: '#0052cc', // Blue
    success: '#0B875B', // green
    danger: '#E13C3C', // red
    warning: '#F89C1C', // orange
    secondary: '#F4F5F7', // light grey

    textDarkest: '#172b4d',
    textDark: '#42526E',
    textMedium: '#5E6C84',
    textLight: '#8993a4',
    textLink: '#0052cc',

    backgroundDarkPrimary: '#0747A6',
    backgroundMedium: '#dfe1e6',
    backgroundLight: '#ebecf0',
    backgroundLightest: '#F4F5F7',
    backgroundLightPrimary: '#D2E5FE',
    backgroundLightSuccess: '#E4FCEF',

    borderLightest: '#dfe1e6',
    borderLight: '#C1C7D0',
    borderInputFocus: '#4c9aff',
}

export const issuePriorityColors = {
    [IssuePriority.HIGHEST]: '#CD1317', // red
    [IssuePriority.HIGH]: '#E9494A', // orange
    [IssuePriority.MEDIUM]: '#E97F33', // orange
    [IssuePriority.LOW]: '#2D8738', // green
    [IssuePriority.LOWEST]: '#57A55A', // green
}

export const zIndexValues = {
    modal: 1000,
    dropdown: 101,
    navLeft: 100,
}

export const font = {
    size: size => `font-size: ${size}px;`,
}

export const mixin = {
    darken: (colorValue, amount) => {
        const rgb = hexToRgb(colorValue)
        const darkened = rgb.map((value) => Math.max(0, value - amount * 255))
        return rgbToHex(darkened)
    },
    lighten: (colorValue, amount) => {
        const rgb = hexToRgb(colorValue)
        const lightened = rgb.map((value) => Math.min(255, value + amount * 255))
        return rgbToHex(lightened)
    },
    boxShadowDropdown: css`
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
  `,
    clickable: css`
    cursor: pointer;
    user-select: none;
  `,
    backgroundImage: imageURL => css`
    background-image: url("${imageURL}");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: ${color.backgroundLight};
  `,
    scrollableY: css`
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
    customScrollbar: ({ width = 8, background = color.backgroundMedium } = {}) => css`
    &::-webkit-scrollbar {
      width: ${width}px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 99px;
      background: ${background};
    }
  `,
    link: (colorValue = color.textLink) => css`
    cursor: pointer;
    color: ${colorValue};
    &:hover, &:visited, &:active {
      color: ${colorValue};
    }
    &:hover {
      text-decoration: underline;
    }
  `,
    tag: (background = color.backgroundMedium, colorValue = color.textDarkest) => css`
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    color: ${colorValue};
    background: ${background};
    ${font.size(12)}
    i {
      margin-left: 4px;
    }
  `,
}


function hexToRgb (hex) {
    hex = hex.replace(/^#/, '')
    const bigint = parseInt(hex, 16)
    return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255,
    ]
}

function rgbToHex (rgb) {
    return `#${rgb.map(value => {
        const hex = value.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')}`
}