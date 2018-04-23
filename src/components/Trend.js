import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

import ReactEcharts from 'echarts-for-react';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 150,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        //padding: theme.spacing.unit * 4,
    },
});

class SimpleModal extends React.Component {
    state = {
        open: false,
        option_prices: {},
        netid: this.props.netid
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    componentDidMount() {
        this.getPriceChart(this.state.netid)
            .then(res => {
                this.setState({
                    option_prices: res.option
                })
                console.log("option_data is: " + this.state.option_data)
            }
            ).catch(err => console.log(err));
    }


    getPriceChart = async netid => {
        const response = await fetch("/api/prices");
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };


    render() {
        const { classes } = this.props;

        return (
            <div>
                <ReactEcharts
                    option={this.state.option_prices}
                    style={{ height: '300px', weight: '500px' }}
                    opts={{ renderer: 'svg' }} // use svg to render the chart.
                />
            </div>
        );
    }
}

SimpleModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
