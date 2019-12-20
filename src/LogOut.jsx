import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class LogOut extends Component {

    componentDidMount() {
        fetch('/logout')
            .then((res) => {
                if (res.status === 200) {
                    alert('Successfully LogOut!')
                } else {
                    throw new Error(res.error.text)
                }
            })
            .catch((err) => {
                    console.log(err);
                    alert("LogOut failed!");
                }
            )
    }

    render() {
        return (
            <Redirect to='/'/>
        );
    }
}