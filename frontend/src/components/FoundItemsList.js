import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { Typography } from '@mui/material';
import NavBar from './NavBar';

const FoundItemsList = ({ items }) => {
    return (
        <div>
            <NavBar /> {/* Including the NavBar at the top */}
            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    List of Found Items
                </Typography>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Place Found</th>
                            <th>Place Handed</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.title}</td>
                                <td>{item.placeFound}</td>
                                <td>{item.placeHanded}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default FoundItemsList;