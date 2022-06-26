import React from 'react'
import AuthService from "../services/auth.service"

const currentUser = AuthService.getCurrentUser();

export const CustomDropdown = (props) => (
  <div className="form-group">
    <select
      className="form-control"
      name="{props.name}"
      onChange={props.onChange}
    >
      <option defaultValue>{props.name}</option>
      {props.options.map((item, index) => (
        <option key={index} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
)
export default class CategoryDropDown extends React.Component {
  constructor() {
    super()
    this.state = {
      text: 'Pasirinkti kategoriją',
      collection: [],
      value: '',
    }
  }
  componentDidMount() {
    fetch('http://localhost:8080/api/categories/',
    {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.accessToken}`
        }
    })
      .then((response) => response.json())
      .then((res) => this.setState({ collection: res }))
  }

  onChange = (event) => {
    this.setState({ value: event.target.value })
  }
  render() {
    return (
      <div>
        <CustomDropdown
          name={this.state.text}
          options={this.state.collection}
          onChange={this.onChange}
        />
      </div>
    )
  }
}