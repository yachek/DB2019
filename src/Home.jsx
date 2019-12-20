import React, { Component } from 'react';
import {Card, CardBody, CardText, CardHeader, CardImg, CardTitle, Button} from "reactstrap";

function RenderItem({ item }) {
  return(
      <Card>
        <CardBody>
          <CardHeader>{item.name}</CardHeader>
          <CardTitle>Price: {item.price}</CardTitle>
        </CardBody>
        <CardBody className='d-flex justify-content-center'>
            <img width='40%' src={item.photoPath} alt={item.name}/>
        </CardBody>
        <CardBody>
          <CardText>{item.description}</CardText>
        </CardBody>
        <div className='d-flex justify-content-center '>
          <Button color='success' className='col-5'>Order</Button>
        </div>
      </Card>
  );
}

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...',
      items: null
    }
  }
  
  componentDidMount() {
    fetch('/home')
        .then(res => res.json())
        .then(json => {
          this.setState({items: json.map((item) => {
              return(
                  <div className='col-12'>
                    <RenderItem item={item}/>
                  </div>
              )
            })})
        })
        .catch(err => {
          console.log(err);
          alert(err);
        })
  }
  
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>{this.state.items}</p>
      </div>
    );
  }
}