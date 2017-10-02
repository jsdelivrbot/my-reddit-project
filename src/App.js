import React, { Component } from 'react';
import NavBar from '../src/components/NavBar';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import Home from './components/Home';
import Posts from './components/Posts';
import Details from './components/Details';
import {selectedSubreddit, fetchPostsIfNeeded, invalidateSubreddit} from './actions'
import PropTypes from 'prop-types';

class App extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
      const { dispatch, selectedSubreddit} = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  handleChange(nextSubreddit) {
    this.props.dispatch(selectedSubreddit(nextSubreddit))
    this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
  }

  handleRefresh(event) {
    event.preventDefault();
    const {dispatch, selectedSubreddit} = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const {selectedSubreddit, posts, isFetching, lastUpdated} = state
    return (
      <div className="App">
        <SubFilter value={selectedSubreddit} onChange={this.handleChange} options={['reactjs', 'frontend']} />
        <p> {lastUpdated && <span> Last updated at {new Date(lastUpdates).toLocaleTimeString()}.{' '}</span>}
          {!isFetching && <a href="#" onClick={this.handleRefresh}>Refresh</a>}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
        {posts.length > 0 &&
          <div style={{opacity: isFetching ? 0.5 : 1}}>
          <Posts posts={posts} />
        </div>}
      </div>
    )
  }
}

App.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

export default App;
