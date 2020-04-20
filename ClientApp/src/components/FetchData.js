import React, { Component } from "react";
import authService from "./api-authorization/AuthorizeService";
import {
  Alert,
  Table,
  Input,
  Form,
  FormGroup,
  Label,
  Button,
  Container,
  Row,
  Col,
  Collapse,
} from "reactstrap";
import DeleteButton from "./DeleteButton";
import update from "immutability-helper";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: false,
      isAddingProduct: false,
      newProductId: null,
      newProductName: null,
      newProductQuantity: null,
      showSaveSuccesAlert: false,
      showSaveFailAlert: false,
      showAddedSucessAlert: false,
      showAddedFailAlert: false,
      showDeletedSucessAlert: false,
      showDeletedFailAlert: false,
    };
    this.handleChangeToQuantity = this.handleChangeToQuantity.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleIsAddingProduct = this.handleIsAddingProduct.bind(this);
    this.handleCreateProduct = this.handleCreateProduct.bind(this);
    this.handleChangeToProductName = this.handleChangeToProductName.bind(this);
    this.handleChangeToNewQuantity = this.handleChangeToNewQuantity.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.dismissSuccessSaveAlert = this.dismissSuccessSaveAlert.bind(this);
    this.dismissFailSaveAlert = this.dismissFailSaveAlert.bind(this);
    this.dismissAddedSucessAlert = this.dismissAddedSucessAlert.bind(this);
    this.dismissAddedFailAlert = this.dismissAddedFailAlert.bind(this);
    this.dismissDeletedSucessAlert = this.dismissDeletedSucessAlert.bind(this);
    this.dismissDeletedFailAlert = this.dismissDeletedFailAlert.bind(this);
  }

  componentDidMount() {
    const existingProducts = JSON.parse(
      window.localStorage.getItem("products")
    );
    if (existingProducts === null) {
      this.setState({ products: [] });
      return;
    }
    this.setState({ products: existingProducts });
  }

  handleChangeToQuantity(event) {
    const changedProductIndex = this.state.products.findIndex(
      (product) => product.id.toString() === event.target.name.toString()
    );
    const newState = update(this.state, {
      products: {
        [changedProductIndex]: {
          quantity: { $set: event.target.value },
        },
      },
    });
    this.setState(newState);
  }

  handleDelete(event) {
    try {
      const id = event.target.name.toString().split(":")[1];
      const deletedProductIndex = this.state.products.findIndex(
        (product) => product.id.toString() === id
      );
      this.setState({
        products: this.state.products.filter(
          (_, i) => i !== deletedProductIndex
        ),
      });
      this.setState({ showDeletedSucessAlert: true });
    } catch (error) {
      console.error(error);
      this.setState({ showDeletedFailAlert: true });
    }
  }

  handleIsAddingProduct() {
    this.setState({ isAddingProduct: !this.state.isAddingProduct });
  }

  handleChangeToProductName(event) {
    this.setState({ newProductName: event.target.value });
  }

  handleChangeToNewQuantity(event) {
    this.setState({ newProductQuantity: event.target.value });
  }

  handleCreateProduct() {
    try {
      const newProduct = [
        {
          id: Math.floor(Math.random() * Math.floor(1000000)),
          label: this.state.newProductName,
          quantity: this.state.newProductQuantity,
        },
      ];
      const newState = update(this.state, {
        products: {
          $push: newProduct,
        },
      });
      this.setState(newState);
      this.setState({ showAddedSucessAlert: true });
    } catch (error) {
      this.setState({ showAddedFailAlert: true });
      console.error(error);
    }
  }

  handleSaveData() {
    try {
      window.localStorage.setItem(
        "products",
        JSON.stringify(this.state.products)
      );
      this.setState({ showSaveSuccesAlert: true });
    } catch (error) {
      console.error(error);
      this.setState({ showSaveFailAlert: true });
    }
  }

  dismissSuccessSaveAlert() {
    this.setState({ showSaveSuccesAlert: false });
  }

  dismissFailSaveAlert() {
    this.setState({ showSaveFailAlert: false });
  }

  dismissAddedSucessAlert() {
    this.setState({ showAddedSucessAlert: false });
  }

  dismissAddedFailAlert() {
    this.setState({ showAddedFailAlert: false });
  }

  dismissDeletedSucessAlert() {
    this.setState({ showDeletedSucessAlert: false });
  }

  dismissDeletedFailAlert() {
    this.setState({ showDeletedFailAlert: false });
  }

  render() {
    // let contents = this.state.loading ? (
    //   <p>
    //     <em>Loading...</em>
    //   </p>
    // ) : (
    //   FetchData.renderForecastsTable(this.state.products)
    // );

    return (
      <React.Fragment>
        <Alert
          color="success"
          isOpen={this.state.showSaveSuccesAlert}
          toggle={this.dismissSuccessSaveAlert}
        >
          Les données ont été enregistré avec succès.
        </Alert>
        <Alert
          color="danger"
          isOpen={this.state.showSaveFailAlert}
          toggle={this.dismissFailSaveAlert}
        >
          Une erreur est survenue lors de l'enregistrement des données. Veuillez
          réessayer plus tard.
        </Alert>
        <Alert
          color="success"
          isOpen={this.state.showAddedSucessAlert}
          toggle={this.dismissAddedSucessAlert}
        >
          Produit ajouté avec succès.
        </Alert>
        <Alert
          color="danger"
          isOpen={this.state.showAddedFailAlert}
          toggle={this.dismissAddedFailAlert}
        >
          Une erreur est survenue lors de l'ajout d'un produit.
        </Alert>
        <Alert
          color="success"
          isOpen={this.state.showDeletedSucessAlert}
          toggle={this.dismissDeletedSucessAlert}
        >
          Produit supprimé avec succès.
        </Alert>
        <Alert
          color="danger"
          isOpen={this.state.showDeletedFailAlert}
          toggle={this.dismissDeletedFailAlert}
        >
          Une erreur est survenue lors de la suppression d'un produit.
        </Alert>
        <div id="Table">
          <Table hover responsive>
            <thead>
              <tr>
                <th scope="col">Produits</th>
                <th scope="col">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products !== null
                ? this.state.products.map((product) => (
                    <tr key={product.id.toString()}>
                      <th scope="row">{product.label}</th>
                      <th>
                        <Input
                          value={product.quantity}
                          type="number"
                          name={product.id}
                          onChange={this.handleChangeToQuantity}
                        />
                      </th>
                      <th>
                        <DeleteButton
                          buttonLabel={"X"}
                          label={product.label}
                          id={product.id}
                          handleDeleteClick={this.handleDelete}
                        />
                      </th>
                    </tr>
                  ))
                : null}
            </tbody>
          </Table>
        </div>
        <Container>
          <Row>
            <Col>
              <Button
                color="info"
                size="lg"
                block
                onClick={this.handleIsAddingProduct}
              >
                Ajouter un produit
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                color="success"
                size="lg"
                block
                onClick={this.handleSaveData}
              >
                Enregistrer
              </Button>
            </Col>
          </Row>
          <Collapse isOpen={this.state.isAddingProduct}>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="productNameInput">Nom du produit</Label>
                    <Input
                      type="text"
                      name="productName"
                      id="productNameInput"
                      value={this.state.newProductName}
                      required={true}
                      onChange={this.handleChangeToProductName}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="productQuantityInput">Quantité initiale</Label>
                    <Input
                      type="number"
                      name="prodcutQuantity"
                      id="productQuantityInput"
                      value={this.state.newProductQuantity}
                      required={true}
                      onChange={this.handleChangeToNewQuantity}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                size="lg"
                color="warning"
                block
                onClick={this.handleCreateProduct}
              >
                Ajouter
              </Button>
            </Form>
          </Collapse>
        </Container>
      </React.Fragment>
    );
  }

  async populateWeatherData() {
    const token = await authService.getAccessToken();
    const response = await fetch("weatherforecast", {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}
