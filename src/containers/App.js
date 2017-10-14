import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit} from '../actions'
import SubFilter from '../components/SubFilter'
import Posts from '../components/Posts'

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
    this.props.dispatch(selectSubreddit(nextSubreddit))
    this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
  }

  handleRefresh(event) {
    event.preventDefault();
    const {dispatch, selectedSubreddit} = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const {selectedSubreddit, posts, isFetching, lastUpdated} = this.props
    return (
      <div className="App">
        <SubFilter value={selectedSubreddit} onChange={this.handleChange} options={['bouldering', 'climbing', 'hiking']} />
        <p> {lastUpdated && <span> Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}</span>}
          {!isFetching && <button onClick={this.handleRefresh}>Refresh</button>}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading....</h2>}
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

function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || {
    isFetching: true,
    items: []
  }
  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
