import React, {useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import { createHashHistory } from "history";

// Material UI
import { Backdrop, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Checkbox, IconButton, Tooltip, Avatar, Grid, Chip, List, ListItem, ListItemText, ListItemAvatar, Menu, MenuItem, ListItemIcon, ButtonGroup, FormControl, Select, Button, Box, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { List as ListIcon, Delete, FilterList, Image, MoreHoriz, Edit, FileCopy, ChevronRight, ChevronLeft, AddBox, ArrowDropDown, PersonAdd } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

// Plug ins
import Moment from 'moment';

// API Service
import { apiConfig } from '../../../config/apiConfig/index';


const history = createHashHistory();

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'user_name', numeric: false, disablePadding: false, label: 'User Name' },
  { id: 'user_email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created Date' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, handlePageChange, enbPrev, enbNext } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const handlePageChanger = (value) => {
    handlePageChange(value);
  }

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        <TableCell padding="checkbox" className={classes.tableCheckbox}>
          <IconButton onClick={() => history.push('/users/add')} aria-label="filter list">
            <AddBox />
          </IconButton>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            className={classes.tableBorder}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell padding="checkbox" className={classes.tableCheckbox}>
          <ButtonGroup variant="text" aria-label="text primary button group">
            <IconButton disabled={enbPrev} onClick={() => handlePageChanger('previous')} className={classes.navButtons} aria-label="filter list">
              <ChevronLeft />
            </IconButton>
            <IconButton disabled={enbNext} onClick={() => handlePageChanger('next')} className={classes.navButtons} aria-label="filter list">
              <ChevronRight />
            </IconButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  enbNext: PropTypes.bool.isRequired,
  enbPrev: PropTypes.bool.isRequired,
};


const useStyles = makeStyles((theme) => (
  {
    root: {
      width: '100%',
      overflowX: 'unset !important'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer - 1,
      color: '#fff',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      overflowX: 'unset !important'
    },
    table: {
      minWidth: 750,
    },
    tableContainer: {
      overflowX: 'unset !important'
    },
    tableCell: {
      padding: '0px 3px',
    },
    tableBorder: {
    },
    tableAvatar: {
      width: '100%',
      maxWidth: 360,
    },
    navButtons: {
      padding: '5px',
      borderRight: 'none!important'
    },
    tableCheckbox: {
      padding: '0px 0 0 0px',
    },
    tableChip: {
      margin: '5px'
    },
    tableHead: {
      backgroundColor: 'unset'
    },
    topButtons: {
      marginLeft: '10px'
    },
    tableAvatarCell: {
      paddingLeft: '4px',
      paddingRight: '4px'
    },
    totalContacts: {
      paddingTop: '10px',
      color: '#9e9e9e'
    },
    pageHeadPadding: {
      marginLleft: '15px'
    },
    moreTooltip: {
    },
    tableCellName: {
      fontWeight: 600
    },
    tableBody: {
      color: 'rgba(0, 0, 0, 0.73)'
    },
    tableRow: {
      backgroundColor: '#fff'
    },
    pageHead: {
      color: '#651fff'
    },
    container: {
      margin: '0 0px 7px 8px'
    },
    formControl: {
      margin: 0,
      minWidth: 120,
    },
    searchText: {
      marginTop: '-15px',
      marginRight: '15px'
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));

export default function UsersList() {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created_at');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(-1);
  const [showMore, setShowMore] = useState(-1);
  const [showMenu, setShowMenu] = useState(-1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Something went wonrg, Please try again later!');
  const [severity, setSeverity] = useState('error');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [, setGlobalSearch] = useState('');
  const [apiCall, setApiCall] = useState(true);

  useEffect(() => {
    setLoader(true);
    apiConfig().get('users')
      .then(res => {
        setLoader(false);
        if (res.data.status === 200) {
          setRows(res.data.data);
          setAllItems(res.data.data);
          setTotalPages(Math.trunc(res.data.data.length / rowsPerPage));
        } else {
          setErrorMsg('Something went wonrg, Please try again later!');
          setShowError(true);
        }
      })
      .catch(() => {
        setLoader(false);
        setErrorMsg('Something went wonrg, Please try again later!');
        setShowError(true);
      })
  }, [apiCall]);


  const handlePageChange = (value) => {
    let currentPage = page;
    if (value === 'next') {
      let totalPage = rows.length;
      totalPage = Math.trunc(totalPage / rowsPerPage)
      currentPage++;
      if (totalPage >= currentPage) {
        setPage(currentPage);
      }
    } else if (value === 'previous') {
      currentPage--;
      if (currentPage >= 0) {
        setPage(currentPage);
      }
    }
  }

  const handleChipClick = (id) => {
    if (showMore === id) {
      setShowMore(-1);
    } else {
      setShowMore(id);
    }
  }

  const handleMenuClick = (e, id) => {
    if (showMenu === id) {
      setShowMenu(-1);
      setAnchorEl(null);
    } else {
      setShowMenu(id);
      setAnchorEl(e.currentTarget);
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    handleMenuClick(e, id)
    apiConfig().delete(`users/${id}`)
      .then(res => {
        if (res.data.status === 200) {
          setShowError(true);
          setSeverity('success');
          setErrorMsg(res.data.message);
          setApiCall(false);
          setApiCall(true);
        } else {
          setShowError(true);
          setSeverity('error');
          setErrorMsg('Something went wonrg, Please try again later!');
        }
      })
      .catch(() => {
        setShowError(true);
        setSeverity('error');
        setErrorMsg('Something went wonrg, Please try again later!');
      })
  }


  const handleLocationFilter = (event, name) => {
    const selectedIndex = selectedLocation.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedLocation, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedLocation.slice(1));
    } else if (selectedIndex === selectedLocation.length - 1) {
      newSelected = newSelected.concat(selectedLocation.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedLocation.slice(0, selectedIndex),
        selectedLocation.slice(selectedIndex + 1),
      );
    }
    let rows = [];
    allItems.forEach(row => {
      if (newSelected.includes(row.location))
        rows.push(row);
    })
    setSelectedLocation(newSelected);
    setRows(rows);
    
    setTotalPages(Math.trunc(rows.length / rowsPerPage));
  };

  const handleNameSearch = (e) => {
    let searchValue = e.target.value;
    let rows = [];
    allItems.forEach(row => {
      if (row.user_name.toLowerCase().includes(searchValue.toLowerCase()))
        rows.push(row);
    })
    setGlobalSearch(searchValue);
    setRows(rows);
    setTotalPages(Math.trunc(rows.length / rowsPerPage));
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isLocationSelected = (name) => selectedLocation.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <div>
        <Box>
          <Backdrop className={classes.backdrop} open={loader}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Snackbar open={showError} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setShowError(false)}>
            <Alert elevation={6} variant="filled" severity={severity}>
              {errorMsg}
            </Alert>
          </Snackbar>
          <Grid className={classes.container} container spacing={1}>
            <Grid container
              direction="row"
              justify="flex-start"
              spacing={2}
              alignItems="center" xs={5}>
              <Grid item>
                <Typography variant="h4" className={classes.pageHead} gutterBottom>
                  Users <ArrowDropDown />
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.totalContacts} variant="subtitle2" gutterBottom>
                  {rows.length} total
            </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.totalContacts} variant="subtitle2" gutterBottom>
                  Sort by:
            </Typography>
              </Grid>
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={orderBy}
                    onChange={(e) => handleRequestSort(e, e.target.value)}
                  >
                    {headCells.map((headCell) => (<MenuItem value={headCell.id}>{headCell.label}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container
              direction="row"
              justify="flex-end"
              alignItems="center" xs={7}>
              <Grid item>
              </Grid>
              <Grid item>
                <TextField className={classes.searchText} onChange={(e) => handleNameSearch(e)} id="standard-basic" label="Search by name" />
                <Button
                  variant="contained"
                  color="default">
                  <ListIcon />
                </Button>
                <Button
                  className={classes.topButtons}
                  variant="contained"
                  color="default"
                  endIcon={<FilterList />}
                >
                  Filter
              </Button>
                <Button
                  className={classes.topButtons}
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAdd />}
                  onClick={() => history.push('/users/add')}
                >
                  Add User
              </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.topButtons}>
                  <MoreHoriz />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      <TableContainer className={classes.tableContainer}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            handlePageChange={handlePageChange}
            rowCount={rows.length}
            enbNext={totalPages <= page}
            enbPrev={page <= 0}
          />
          <TableBody className={classes.tableBody}>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.user_id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.user_id}
                    selected={isItemSelected}
                    className={classes.tableRow}
                  >
                    <TableCell padding="checkbox" className={classes.tableCell}>
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.user_id)}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBorder} component="th" id={labelId} scope="row" padding="none" >
                      <List className={classes.tableAvatar}>
                        <ListItem className={classes.tableAvatarCell}>
                          <ListItemAvatar>
                            <Avatar>
                              <Image />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={row.user_name} />
                        </ListItem>
                      </List>
                    </TableCell>
                    <TableCell className={classes.tableCell}>{row.user_email}</TableCell>
                    <TableCell className={classes.tableCell}>{Moment(row.created_date).format("D MMM YYYY")}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClickCapture={(e) => handleMenuClick(e, row.user_id)}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={showMenu === row.user_id}
                        onClose={(e) => handleMenuClick(e, row.user_id)}>
                        <MenuItem onClick={() => history.push(`/users/edit/${row.user_id}`)}>
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit">Edit</Typography>
                        </MenuItem>
                        <MenuItem onClick={(e) => handleDeleteClick(e, row.user_id)}>
                          <ListItemIcon>
                            <Delete fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit">Remove</Typography>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
