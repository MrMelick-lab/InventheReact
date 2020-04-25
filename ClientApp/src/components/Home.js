import React, { Component } from "react";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Bonjour</h1>
        <p>Bienvenue sur inventhe</p>
        <p>
          Pour gérer vos produits cliquer sur Manage Products après un login
        </p>
      </div>
    );
  }
}
