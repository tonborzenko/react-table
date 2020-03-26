import React from 'react';

const Explore = (props) => {
    return <div className="text-center py-4">Data ID: {props.match.params.keyword}</div>;
}

export default Explore;