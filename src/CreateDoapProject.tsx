import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Paper, Button } from "@material-ui/core";
import { FormControl, TextField, Input, InputLabel, FormHelperText, Select } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  settingsForm: {
    width: '100%',
    // textAlign: 'center',
    '& .MuiFormControl-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(1),
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(2, 2),
  },
  fullWidth: {
    width: '100%',
  },
  normalFont: {
    fontSize: '14px',
  },
  smallerFont: {
    fontSize: '12px',
  },
  alignLeft: {
    textAlign: 'left'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  }
}))


export default function CreateDoapProject() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    license_autocomplete: '',
    category_dropdown: '',
    project_git_repository: '',
    project_name: '',
    project_description: '',
    project_homepage: '',
    project_issues: '',
    project_mailinglist: '',
    project_downloadpage: '',
    project_wiki: '',
    project_contributor_name: '',
    project_contributor_email: ''
  });
  // const form_category_dropdown = React.createRef(); 
  
  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    let doap_content = `@prefix doap: <http://usefulinc.com/ns/doap#> .
@prefix asf: <http://projects.apache.org/ns/asfext#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

[]
  a doap:Project ;
  doap:name "` + state.project_name + `" ;
  doap:description "` + state.project_description + `" ;

  doap:license "` + state.license_autocomplete + `" ;
  doap:homepage <` + state.project_homepage + `> ;
  doap:bug-database <` + state.project_issues + `> ;
  doap:mailing-list <` + state.project_mailinglist + `> ;
  doap:download-page <` + state.project_downloadpage + `> ;
  doap:wiki <` + state.project_wiki + `>

  doap:category "` + state.category_dropdown + `" ;
  doap:repository [
    a doap:GitRepository ;
    doap:location <` + state.project_git_repository + `> ;
  ] ;
  doap:maintainer [
    a foaf:Person ;
    foaf:name "` + state.project_contributor_name + `" ;
    foaf:mbox <mailto:` + state.project_contributor_email + `>
  ] .`;
    
    // Trigger file download
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(doap_content));
    element.setAttribute('download', '.doap-project.ttl');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setState({...state, open: true})
  }
  // Close Snackbar
  const handleClose = () => {
    setState({...state, open: false})
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    setState({...state, [event.target.id]: event.target.value})
  }

  const handleCategoryDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, category_dropdown: event.target.value})
  }

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
        Create a DOAP description for your project 📝
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl className={classes.settingsForm}>
          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
              📋 Project informations
            </Typography>
            <TextField
              id="project_name"
              label="Project name"
              placeholder="Project name"
              required
              className={classes.fullWidth}
              onChange={handleChange}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_description"
              label="Project description"
              placeholder="Project description"
              required
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              multiline={true}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />

            <Autocomplete
              id="license_autocomplete"
              onInputChange={(event, newInputValue) => {
                setState({...state, 'license_autocomplete': newInputValue})
              }}
              options={['MIT license', 'Apache license']}
              freeSolo={true}
              includeInputInList={true}
              renderInput={params => <TextField {...params} 
              label="License ⚖️" 
              variant="outlined"
              size='small'
              />}
            />
            <FormHelperText id="helper-sparql-endpoint">Choose a license at...</FormHelperText>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="form-graph-overview-label">
                Project category
              </InputLabel>
              <Select
                id="category_dropdown"
                // value={state.category_dropdown}
                onChange={handleCategoryDropdown}
                label="Project category / type"
                autoWidth
              >
                <MenuItem value="Deep Learning">Deep Learning</MenuItem>
                <MenuItem value="Data processing">Data processing</MenuItem>
              </Select>
            </FormControl>
            <FormHelperText id="helper-graphs-overview">Pick a category best describing your project</FormHelperText>
          </Paper>

          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
              🔗 Project links
            </Typography>
            <FormHelperText>
              Links to the resources of this project. 
            </FormHelperText>
            <TextField
              id="project_git_repository"
              label="Project Git repository (GitHub/GitLab)"
              placeholder="Project Git repository (GitHub/GitLab)"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_homepage"
              label="Project homepage 🏠"
              placeholder="Project homepage 🏠"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_issues"
              label="Project issue tracker 🚧"
              placeholder="Project issue tracker 🚧"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_mailinglist"
              label="Project mailing list or chat URL 💬"
              placeholder="Project mailing list or chat URL 💬"
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_downloadpage"
              label="Project download page 📥"
              placeholder="Project download page 📥"
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_wiki"
              label="Project wiki 📖"
              placeholder="Project wiki 📖"
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />

          </Paper>
          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
             👤 Contact details
            </Typography>
            <FormHelperText>
              Informations about the developers and responsibles of this project. 
            </FormHelperText>
            <TextField
              id="project_contributor_name"
              label="Contributor name"
              placeholder="Contributor name"
              required
              className={classes.fullWidth}
              onChange={handleChange}
              // defaultValue={triplestore.search_query}
              variant="outlined"
              // inputRef={this.formSearchQuery}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_contributor_email"
              label="Contributor email"
              placeholder="Contributor email"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
              // inputRef={this.formSearchQuery}
              // defaultValue={triplestore.search_query}
            />
          </Paper>

          <div style={{width: '100%', textAlign: 'center'}}>
            <Button type="submit" 
              // style={{width: '100%'}}
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<GetAppIcon />}
              color="secondary" >
                Download DOAP description
            </Button>
          </div>

          <Snackbar open={state.open} onClose={handleClose} autoHideDuration={3000}>
            <MuiAlert elevation={6} variant="filled" severity="success">
              Thanks!
            </MuiAlert>
          </Snackbar>
        </FormControl>
      </form>

    </Container>
  )
}