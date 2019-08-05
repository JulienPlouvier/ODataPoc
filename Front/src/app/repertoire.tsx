import React, { Component } from "react";
import moment from "moment"
import { withStyles } from "@material-ui/styles";
import { createStyles, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, AppBar, Button, TextField } from "@material-ui/core";
import { MuiProps, muiOptions } from "../infrastructure/materialUiThemeProvider";
import { Person, FamilyName } from "./models/Person";
import { AdressToString } from "./models/Address";
import { get } from "../infrastructure/api";
import { operators, buildOdataQueryFilter, OdataWrapper, fields, fieldType, addressFields } from "../infrastructure/odataQueryBuilder";

type Operator = {
    key: operators,
    value: string
}
type Comparator = {
    key: any,
    value: string
}

const stringOperators: Operator[] = [
    { key: operators.startsWith, value: 'commence par ...' },
    { key: operators.endsWith, value: 'finit par ...' },
    { key: operators.contains, value: 'contient ...' },]

const dateOperators: Operator[] = [
    { key: operators.before, value: 'avant ...' },
    { key: operators.after, value: 'après ...' }]

const familyOperators: Operator[] = [
    { key: operators.in, value: 'appartient à ...' },
    { key: operators.notIn, value: 'n\'appartient pas à ...' }
]

const familyComparators: Comparator[] = [
    { key: FamilyName.Charles, value: 'la famille de Charles' },
    { key: FamilyName.Henry, value: 'la famille de Henry' },
    { key: FamilyName.Paul, value: 'la famille de Paul' },
]


interface RepertoireState {
    Operator: operators
    Field: string
    FieldType: fieldType
    AddressField: addressFields
    Comparator: string
    DisplayedPeople: Person[]
    OperatorsForField: Operator[]
    ComparatorsForField: Comparator[]
}

class Repertoire extends Component<MuiProps, RepertoireState> {

    constructor(props) {
        super(props);
        this.state = { Comparator: '', Operator: operators.startsWith, Field: '', DisplayedPeople: [], OperatorsForField: [], ComparatorsForField: [], FieldType: fieldType.string, AddressField: addressFields.Street }
    }

    async componentDidMount() {
        var people = await get<OdataWrapper<Person[]>>("Persons")
        this.setState({ DisplayedPeople: people.value })
    }

    handleOperatorChange = (newValue): void => {
        this.setState({ Operator: newValue })
    }

    handleAddressFieldChange = (newValue): void => {
        this.setState({ AddressField: newValue })
    }

    handleComparatorChange = (newValue): void => {
        this.setState({ Comparator: newValue })
    }

    handleFieldChange = (newValue): void => {
        let newOperators
        let newComparators: any[] = []
        let newFieldType: fieldType = fieldType.string
        if (newValue == fields.Address || newValue == fields.Name)
            newOperators = stringOperators
        if (newValue == fields.Birth) {
            newOperators = dateOperators
            newFieldType = fieldType.date
        }
        if (newValue == fields.Family) {
            newOperators = familyOperators
            newComparators = familyComparators
            newFieldType = fieldType.family
        }

        this.setState({ Field: newValue, FieldType: newFieldType, OperatorsForField: newOperators, ComparatorsForField: newComparators })
    }

    sendQuery = async () => {
        if (!this.state.Comparator || !this.state.Field) {
            console.log(this.state)
            return
        }
        var query = buildOdataQueryFilter(this.state.Field, this.state.FieldType, this.state.Comparator, this.state.Operator, this.state.AddressField)
        var people = await get<OdataWrapper<Person[]>>("Persons" + query)
        this.setState({ DisplayedPeople: people.value })
    }

    reset = async () => {
        var people = await get<OdataWrapper<Person[]>>("Persons")
        this.setState({ DisplayedPeople: people.value })
    }

    render() {
        let classes = this.props.classes
        let people = this.state.DisplayedPeople
        return (
            <div className={classes.VerticalContainer}>
                <AppBar>
                    <Toolbar>
                        Repertoire
                    </Toolbar>
                </AppBar>
                <Paper className={classes.VerticalContainerMarged}>
                    <div>
                        Queries
                    </div>
                    <div className={classes.HorizontalContainer}>
                        <FormControl className={classes.FormControl}>
                            <InputLabel>Champ</InputLabel>
                            <Select
                                value={this.state.Field}
                                onChange={event => this.handleFieldChange(event.target.value)}
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
                        {this.state.Field == fields.Address
                            ? <FormControl className={classes.FormControl}>
                                <InputLabel>Champ d'addresse</InputLabel>
                                <Select
                                    value={this.state.AddressField}
                                    onChange={event => this.handleAddressFieldChange(event.target.value)}
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
                                value={this.state.Operator}
                                onChange={event => this.handleOperatorChange(event.target.value)}
                                inputProps={{
                                    name: 'Operateur',
                                }}
                            >
                                {this.state.OperatorsForField.map(x => <MenuItem value={x.key}>{x.value}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {this.state.ComparatorsForField.length > 0
                            ? <FormControl className={classes.FormControl}>
                                <InputLabel>Comparateur</InputLabel>
                                <Select
                                    value={this.state.Comparator}
                                    onChange={event => this.handleComparatorChange(event.target.value)}
                                    inputProps={{
                                        name: 'Operateur',
                                    }}
                                >
                                    {this.state.ComparatorsForField.map(x => <MenuItem value={x.key}>{x.value}</MenuItem>)}
                                </Select>
                            </FormControl>
                            : <TextField label="Valeur de comparaison"
                                placeholder="Comparateur"
                                className={classes.FormControl}
                                onChange={event => this.handleComparatorChange(event.target.value)} />
                        }
                    </div>
                    <div>
                        <Button variant="contained" color="primary" className={classes.Button} onClick={_ => this.sendQuery()}>
                            Send
                    </Button>
                        <Button variant="contained" color="primary" className={classes.Button} onClick={_ => this.reset()}>
                            Reset
                    </Button>
                    </div>
                </Paper>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Family of Origin</TableCell>
                                <TableCell>Adress 1</TableCell>
                                <TableCell>Adress 2</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {people.length > 0 ? people.map((x, i) =>
                                <TableRow key={i}>
                                    <TableCell>{i}</TableCell>
                                    <TableCell>{x.Surname + ' '}<b>{x.Name}</b></TableCell>
                                    <TableCell>{moment(x.Birth).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{x.Family}</TableCell>
                                    {x.Addresses.map(address => <TableCell>{AdressToString(address)}</TableCell>)}
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}


let styles = theme =>
    createStyles({
        VerticalContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
        },
        VerticalContainerMarged: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
            margin: '70px 0px 15px 0px'
        },
        HorizontalContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        FormControl: {
            margin: '15px',
            minWidth: '150px'
        },
        Button: {
            margin: '5px 0px 5px 0px'
        }
    })


export default withStyles(styles, muiOptions)(Repertoire)