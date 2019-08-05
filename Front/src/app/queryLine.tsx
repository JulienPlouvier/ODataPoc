import React, { Component } from "react";
import { MuiProps, muiOptions } from "../infrastructure/materialUiThemeProvider";
import { FormControl, InputLabel, Select, MenuItem, TextField, createStyles, withStyles } from "@material-ui/core";
import { fields, addressFields } from "../infrastructure/odataQueryBuilder";
import { Filter } from "./models/Filters";

interface QueryLineProps {
    ChangeField: (value, id) => void
    ChangeAddressField: (value, id) => void
    ChangeOperator: (value, id) => void
    ChangeComparator: (value, id) => void
    filter: Filter
    Id: number
}

class QueryLine extends Component<MuiProps & QueryLineProps> {

    render() {
        let classes = this.props.classes
        let filter = this.props.filter
        let id = this.props.Id
        return (<div className={classes.HorizontalContainer}>
            <FormControl className={classes.FormControl}>
                <InputLabel>Champ</InputLabel>
                <Select
                    value={filter.Field}
                    onChange={event => this.props.ChangeField(event.target.value, id)}
                    inputProps={{
                        name: '',
                    }}
                >
                    <MenuItem value={fields.Name}>Nom</MenuItem>
                    <MenuItem value={fields.Birth}>Birthday</MenuItem>
                    <MenuItem value={fields.Family}>Family of Origin</MenuItem>
                    <MenuItem value={fields.Address}>Adresses</MenuItem>
                </Select>
            </FormControl>
            {filter.Field == fields.Address
                ? <FormControl className={classes.FormControl}>
                    <InputLabel>Champ d'addresse</InputLabel>
                    <Select
                        value={filter.AdressField}
                        onChange={event => this.props.ChangeAddressField(event.target.value, id)}
                        inputProps={{
                            name: '',
                        }}
                    >
                        <MenuItem value={addressFields.City}>Ville</MenuItem>
                        <MenuItem value={addressFields.PostalCode}>Code Postal</MenuItem>
                        <MenuItem value={addressFields.Street}>Rue</MenuItem>
                    </Select>
                </FormControl>
                : null}
            <FormControl className={classes.FormControl}>
                <InputLabel>Operateur</InputLabel>
                <Select
                    value={filter.Operator}
                    onChange={event => this.props.ChangeOperator(event.target.value, id)}
                    inputProps={{
                        name: 'Operateur',
                    }}
                >
                    {filter.OperatorsForField.map(x => <MenuItem value={x.key}>{x.value}</MenuItem>)}
                </Select>
            </FormControl>
            {filter.ComparatorsForField.length > 0
                ? <FormControl className={classes.FormControl}>
                    <InputLabel>Comparateur</InputLabel>
                    <Select
                        value={filter.Comparator}
                        onChange={event => this.props.ChangeComparator(event.target.value, id)}
                        inputProps={{
                            name: 'Operateur',
                        }}
                    >
                        {filter.ComparatorsForField.map(x => <MenuItem value={x.key}>{x.value}</MenuItem>)}
                    </Select>
                </FormControl>
                : <TextField label="Valeur de comparaison"
                    placeholder="Comparateur"
                    className={classes.FormControl}
                    onChange={event => this.props.ChangeComparator(event.target.value, id)} />
            }
        </div>)
    }
}

let styles = theme =>
    createStyles({})

export default withStyles(styles, muiOptions)(QueryLine)