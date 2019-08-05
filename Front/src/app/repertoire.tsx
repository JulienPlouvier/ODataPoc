import React, { Component } from "react";
import moment from "moment"
import { withStyles } from "@material-ui/styles";
import { createStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, AppBar, Button, Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import { MuiProps, muiOptions } from "../infrastructure/materialUiThemeProvider";
import { Person, FamilyName } from "./models/Person";
import { AdressToString } from "./models/Address";
import { get } from "../infrastructure/api";
import { operators, buildOdataQueryFilter, OdataWrapper, fields, fieldType } from "../infrastructure/odataQueryBuilder";
import { Operator, Comparator, Filter } from "./models/Filters";
import QueryLine from "./queryLine";


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
    DisplayedPeople: Person[]
    OperatorsForField: Operator[]
    ComparatorsForField: Comparator[]
    Filters: Filter[]
}

class Repertoire extends Component<MuiProps, RepertoireState> {

    constructor(props) {
        super(props);
        this.state = { DisplayedPeople: [], OperatorsForField: [], ComparatorsForField: [], Filters: [] }
    }

    async componentDidMount() {
        var people = await get<OdataWrapper<Person[]>>("Persons")
        this.setState({ DisplayedPeople: people.value })
    }

    handleOperatorChange = (newValue, id): void => {
        let filters = this.state.Filters
        filters[id].Operator = newValue
        this.setState({ Filters: filters })
    }

    handleAddressFieldChange = (newValue, id): void => {
        let filters = this.state.Filters
        filters[id].AdressField = newValue
        this.setState({ Filters: filters })
    }

    handleComparatorChange = (newValue, id): void => {
        let filters = this.state.Filters
        filters[id].Comparator = newValue
        this.setState({ Filters: filters })
    }

    handleFieldChange = (newValue, id): void => {
        let filters = this.state.Filters
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

        filters[id].Field = newValue
        filters[id].FieldType = newFieldType
        filters[id].OperatorsForField = newOperators
        filters[id].ComparatorsForField = newComparators

        this.setState({ Filters: filters })
    }

    addFilter = () => {
        let filters = this.state.Filters
        let newFilter: Filter = {
            Field: '',
            FieldType: fieldType.string,
            Operator: operators.startsWith,
            OperatorsForField: [],
            AdressField: '',
            Comparator: '',
            ComparatorsForField: [],

        }
        filters.push(newFilter)
        this.setState({ Filters: filters })
    }

    sendQuery = async () => {
        if (this.state.Filters.length == 0) {
            console.log(this.state)
            return
        }
        var query = buildOdataQueryFilter(this.state.Filters)
        var people = await get<OdataWrapper<Person[]>>("Persons" + query)
        this.setState({ DisplayedPeople: people.value })
    }

    reset = async () => {
        var people = await get<OdataWrapper<Person[]>>("Persons")
        this.setState({ DisplayedPeople: people.value, Filters: [] })
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
                    <div className={classes.Fab}>
                        Queries
                        <Fab color="primary" aria-label="add" onClick={this.addFilter}>
                            <AddIcon />
                        </Fab>
                    </div>
                    {
                        this.state.Filters.map((x, i) =>
                            <QueryLine Id={i}
                                filter={x}
                                ChangeAddressField={this.handleAddressFieldChange}
                                ChangeComparator={this.handleComparatorChange}
                                ChangeField={this.handleFieldChange}
                                ChangeOperator={this.handleOperatorChange}
                                classes={this.props.classes}
                                children={this.props.children}
                                theme={this.props.theme}
                            />
                        )
                    }
                    <div>
                        <Button variant="contained" color="primary" className={classes.Button} onClick={_ => this.sendQuery()}>
                            Send
                    </Button>
                        <Button variant="contained" color="primary" className={classes.Button} onClick={_ => this.reset()}>
                            Reset
                    </Button>
                    </div>
                </Paper>
                <p>{'Résultat : ' + people.length + ' personnes trouvées (sur 50 prises aléatoirement)'}</p>
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
        },
        Fab: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            minWidth: '200px'
        }
    })


export default withStyles(styles, muiOptions)(Repertoire)