import React from "react"
import { Result } from "antd"

class ErrorBoundary extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    })
  }

  render() {
    const { hasError } = this.state

    if (hasError) {
      return (
        <div className="error-wrapper">
          <Result
            status={500}
            title="Возникла ошибка"
            subTitle="Пожалуйста, подождите некоторое время и попробуйте снова"
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
