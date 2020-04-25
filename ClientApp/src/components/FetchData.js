import React, { Component } from "react";
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
import authService from "./api-authorization/AuthorizeService";
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
    this.handleIsAddingProduct = this.handleIsAddingProduct.bind(this);
    this.handleChangeToProductName = this.handleChangeToProductName.bind(this);
    this.handleChangeToNewQuantity = this.handleChangeToNewQuantity.bind(this);
    this.dismissSuccessSaveAlert = this.dismissSuccessSaveAlert.bind(this);
    this.dismissFailSaveAlert = this.dismissFailSaveAlert.bind(this);
    this.dismissAddedSucessAlert = this.dismissAddedSucessAlert.bind(this);
    this.dismissAddedFailAlert = this.dismissAddedFailAlert.bind(this);
    this.dismissDeletedSucessAlert = this.dismissDeletedSucessAlert.bind(this);
    this.dismissDeletedFailAlert = this.dismissDeletedFailAlert.bind(this);
  }

  async componentDidMount() {
    const token = await authService.getAccessToken();
    const response = await fetch("products", {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
    });
    const existingProducts = await response.json();
    this.setState({
      products: existingProducts,
      loading: false,
    });
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

  handleSaveChangeToQuantity = async (event) => {
    const id = event.currentTarget.id.toString().split(":")[1];
    const newQuantity = this.state.products.find((p) => p.id === id).quantity;
    const token = await authService.getAccessToken();
    const response = await fetch(`products/${id}/?newQuantity=${newQuantity}`, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      method: "PUT",
    });
    if (response.status === 204) {
      this.setState({ showSaveSuccesAlert: true });
    } else {
      this.setState({ showSaveFailAlert: true });
    }
  };

  handleDelete = async (event) => {
    try {
      const id = event.target.name.toString().split(":")[1];
      const token = await authService.getAccessToken();
      const response = await fetch(`products/${id}`, {
        headers: !token ? {} : { Authorization: `Bearer ${token}` },
        method: "DELETE",
      });
      if (response.status === 204) {
        const deletedProductIndex = this.state.products.findIndex(
          (product) => product.id.toString() === id
        );
        this.setState({
          products: this.state.products.filter(
            (_, i) => i !== deletedProductIndex
          ),
        });
        this.setState({ showDeletedSucessAlert: true });
      } else {
        this.setState({ showDeletedFailAlert: true });
      }
    } catch (error) {
      console.error(error);
      this.setState({ showDeletedFailAlert: true });
    }
  };

  handleIsAddingProduct() {
    this.setState({ isAddingProduct: !this.state.isAddingProduct });
  }

  handleChangeToProductName(event) {
    this.setState({ newProductName: event.target.value });
  }

  handleChangeToNewQuantity(event) {
    this.setState({ newProductQuantity: event.target.value });
  }

  handleCreateProduct = async () => {
    try {
      const token = await authService.getAccessToken();
      const response = await fetch(`products`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: `{"quantity": ${this.state.newProductQuantity}, "label": "${this.state.newProductName}"}`,
      });
      if (response.status === 201) {
        const newProduct = [await response.json()];
        const newState = update(this.state, {
          products: {
            $push: newProduct,
          },
        });
        this.setState(newState);
        this.setState({ showAddedSucessAlert: true });
      } else {
        this.setState({ showAddedFailAlert: true });
      }
    } catch (error) {
      this.setState({ showAddedFailAlert: true });
      console.error(error);
    }
  };

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
    return (
      <React.Fragment>
        <Alert
          color="success"
          isOpen={this.state.showSaveSuccesAlert}
          toggle={this.dismissSuccessSaveAlert}
        >
          La quantité du produit a été enregistrée avec succès
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
                        <Button
                          name={`changeQuantitybtn:${product.id}`}
                          id={`changeQuantitybtn:${product.id}`}
                          color={"success"}
                          onClick={this.handleSaveChangeToQuantity}
                        >
                          Enregistrer
                        </Button>
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
}
