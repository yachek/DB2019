import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default function isAdmin(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            fetch('/checkAdmin')
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    } else {
                        throw new Error("You are not admin and/or don't authorized!");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert(err);
                    this.setState({ loading: false, redirect: true });
                });
        }


        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/login" />;
            }
            return <ComponentToProtect {...this.props} />;
        }
    }
}