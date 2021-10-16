import React, { Component } from "react";
import Cookies from 'js-cookie';
import { connect } from "react-redux";
import { checkCookie } from "../../actions/authActions";

class CookietoSession extends Component {

    componentDidMount() {
        const token = Cookies.get('jwt');
        localStorage.setItem('jwt', token);
        this.props.history.push("/dashboard");
    };


    render() {
        return(<html></html>);
    }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { checkCookie }
)(CookietoSession);