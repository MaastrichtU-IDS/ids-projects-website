import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { Typography, Container, Button, Chip, Tooltip } from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import GavelIcon from '@material-ui/icons/Gavel';
import BugReportIcon from '@material-ui/icons/BugReport';
import { Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';

// TODO: add search https://gist.github.com/codegeous/437da0b2afb0246a781b9e6acf00eb4d
class ProjectsDashboard extends Component {

  state = {
    projects_list: []
  }

  // Query SPARQL endpoint to get the URI infos
  componentDidMount() {

    const endpointToQuery = 'https://graphdb.dumontierlab.com/repositories/ids-projects';
    console.log(endpointToQuery);
    axios.get(endpointToQuery + `?query=` + encodeURIComponent(getProjectsQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        this.setState({ projects_list: sparqlResultArray});
        sparqlResultArray.forEach((sparqlResultRow) => {
          console.log(sparqlResultRow.name.value)
          console.log(sparqlResultRow.gitUrl.value)
          // searchResults.push({
          //   foundUri: sparqlResultRow.foundUri.value , 
          //   foundLabel: sparqlResultRow.foundLabel.value
          // })
        })
        // this.setState({ searchResults });
        // this.setState({ isLoading: false });
      })
      .catch(error => {
        console.log(error)
        // this.setState({ requestError: true });
        // this.setState({ isLoading: false });
      })

  }

  render () {
    const pie_data = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#4caf50','#FF6384','#36A2EB','#FFCE56']
      }]
    };
    // const { classes } = this.props;
    return(
      <Container style={{marginTop: '20px'}}>
        <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
          Institute of Data Science projects 🗂️
        </Typography>
        <Doughnut data={pie_data} options={pie_options}/>
        <Pie data={pie_data} options={pie_options}/>
        
        {this.state.projects_list.map(function(project, key){
          return <Paper key={key} elevation={4} style={{padding: '15px', margin: '25px'}}>
            <Typography variant="h5">
              {project.name.value}&nbsp;&nbsp;
              <Chip label={project.programmingLanguage.value} color='primary' />
            </Typography>
            <Typography style={{marginBottom: '10px', marginTop: '5px'}}>
              {project.description.value}
            </Typography>
            {project.category && ( 
              <Typography style={{marginBottom: '10px'}}>
                Category: {project.category.value}
              </Typography>
            )}
            {project.gitUrl && ( 
              <Tooltip title='Git repository'>
                <Button target="_blank"
                href={project.gitUrl.value}>
                  <GitHubIcon />
                </Button>
              </Tooltip>
            )}
            {project.homepage && ( 
              <Tooltip title='Project homepage'>
                <Button target="_blank"
                href={project.homepage.value}>
                  <HomeIcon />
                </Button>
              </Tooltip>
            )}
            {project.downloadpage && ( 
              <Tooltip title='Download page'>
                <Button target="_blank"
                href={project.downloadpage.value}>
                  <CloudDownloadIcon />
                </Button>
              </Tooltip>
            )}
            {project.bugdatabase && ( 
              <Tooltip title='Issue tracker'>
                <Button target="_blank"
                href={project.bugdatabase.value}>
                  <BugReportIcon />
                </Button>
              </Tooltip>
            )}
            {project.license && (
              <Tooltip title='License'>
                <Button target="_blank"
                href={project.license.value}>
                  <GavelIcon />
                </Button>
              </Tooltip> 
            )}
          </Paper>
        })}
      </Container>
    )
  }

}
export default ProjectsDashboard;

const getProjectsQuery = `PREFIX doap: <http://usefulinc.com/ns/doap#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    select * where { 
        ?project a doap:Project ;
           doap:name ?name ;
           doap:description ?description ;
           doap:programming-language ?programmingLanguage .
        OPTIONAL {
            ?project doap:repository [
                a doap:GitRepository ;
                doap:browse ?gitUrl
              ] .
        }
        OPTIONAL {
            ?project doap:bug-database ?bugdatabase .
        }
        OPTIONAL {
            ?project doap:category ?category .
        }
        OPTIONAL {
            ?project doap:created ?created .
        }
        OPTIONAL {
            ?project doap:download-page ?downloadpage .
        }
        OPTIONAL {
            ?project doap:homepage ?homepage .
        }
        OPTIONAL {
            ?project doap:license ?license .
        }
        OPTIONAL {
            ?project doap:shortdesc ?shortdesc .
        }
    }`

const pie_options = {
  legend: {
    display: false
  },
  plugins: {
    labels: {
      // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
      render: 'label',
      // fontSize: 12,

      // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
      fontColor: '#fff',

      // // draw text shadows under labels, default is false
      // textShadow: true,
      // text shadow intensity, default is 6
      // shadowBlur: 10,
      // // text shadow X offset, default is 3
      // shadowOffsetX: -5,
      // // text shadow Y offset, default is 3
      // shadowOffsetY: 5,
      // // text shadow color, default is 'rgba(0,0,0,0.3)'
      // shadowColor: 'rgba(255,0,0,0.75)',
      // position to draw label, available value is 'default', 'border' and 'outside'
      // bar chart ignores this
      // default is 'default'
      // position: 'default',

      // set images when `render` is 'image'
      // images: [
      //   {
      //     src: 'image.png',
      //     width: 16,
      //     height: 16
      //   }
      // ]
    }
  }
}
