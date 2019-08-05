import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors/'
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme'

export type MuiProps = {
    classes: any
    theme?: Theme
}

function createMaterialUiTheme(options: any) {
    return createMuiTheme({
        ...options,
    })
}

export let theme = createMaterialUiTheme({
    palette: {
        primary: {
            light: '#6B6B73',
            main: '#35363A',
            dark: '#27272B',
            contrastText: '#FFF',
        },
        secondary: red,
        error: red,
    },
    breakpoints: {
        values: {
            lg: 1440,
        },
    },
    overrides: {
        MuiListItemIcon: {
            root: {
                color: 'inherit',
            },
        },
        MuiTypography: {
            subheading: {
                color: 'inherit',
            },
            title: {
                color: 'inherit',
            },
        },
        MuiTableCell: {
            head: {
                color: 'inherit',
            },
        },
    },
})

export let muiOptions = { withTheme: true }

export function customStyledComponent(Component) {
    return (style, options) => {
        function StyledComponent(props: { [x: string]: any; classes: any; className: string }) {
            const { classes, className, ...other } = props
            return <Component className={classNames(classes.root, className)} {...other} />
        }
        const styles = typeof style === 'function' ? theme => ({ root: style(theme) }) : { root: style }
        return withStyles(styles, options)(StyledComponent)
    }
}