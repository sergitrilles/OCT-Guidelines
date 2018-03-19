import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';


class AppFooter extends Component {
  render() {
    return (

    <div className="AppFooter">
        <footer>
          <Container>
            <Row>
              <Col xs={2} md={1}>
                {<img src={"http://geo-c.eu/assets/img/flag_yellow_high.jpg"} width="40"/>}
              </Col>
              <Col xs={16} md={11}>
                {<font size="2">GEO-C is funded by the European Commission within the Marie Skłodowska-Curie Actions (ITN - EJD). Grant Agreement number 642332 - GEO-C - H2020-MSCA-ITN-2014.</font>}
              </Col>
            </Row>
          </Container>
        </footer>
      </div>


    );
  }
}

export default AppFooter;
