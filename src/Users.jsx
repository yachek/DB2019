import React, {Component} from 'react';
import {Button, Card, CardBody, CardText, Form, FormGroup, Input} from 'reactstrap';

function RenderUser({ user, isAdmin }) {
    return(
        <Card>
            <CardBody>
                <CardText>id: {user._id}, email: {user.email},
                    isAdmin: {isAdmin}</CardText>
            </CardBody>
        </Card>
    );
}

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            users: null,
            _id: null
        }
    }

    componentDidMount() {
        fetch('/users')
            .then(res => res.json())
            .then(json => {
                this.setState({users: json.map((user) => {
                        return(
                            <div className='col-12'>
                                <RenderUser user={user} isAdmin={user.isAdmin.toString()}/>
                            </div>
                        )
                    })})
            })
            .catch(err => {
                console.log(err);
                alert(err);
            })
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/users', {
            method: 'DELETE',
            body: JSON.stringify({id: this.state._id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res);
                    fetch('/users')
                        .then(res => res.json())
                        .then(json => {
                            this.setState({users: json.map((user) => {
                                    return(
                                        <div className='col-12'>
                                            <RenderUser user={user} isAdmin={user.isAdmin.toString()}/>
                                        </div>
                                    )
                                })})
                        });
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error delete please try again');
            });
    };

    render() {
        return (
            <div className='container'>
                <div className='row row-content d-flex justify-content-center'>
                    <Form model='delete' onSubmit={this.onSubmit} className='col-12'>
                        <FormGroup className='col-12 d-flex justify-content-center'>
                            <h1>Users</h1>
                        </FormGroup>
                        <FormGroup className='col-12 d-flex justify-content-center'>
                            <Input className='col-5'
                                   type='_id'
                                   name='_id'
                                   id='_id'
                                   placeholder='Enter id to delete user'
                                   value={this.state.email}
                                   onChange={this.handleInputChange}
                                   required
                            />
                        </FormGroup>
                        <FormGroup className='col-12 d-flex justify-content-center'>
                            <Button className='col-5' type='submit' color='danger'>
                                Delete
                            </Button>
                        </FormGroup>
                    </Form>
                    {this.state.users}
                </div>
            </div>
        );
    }
}