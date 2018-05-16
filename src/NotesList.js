import React, { Component, Fragment } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Note from './Note';
import AddNote from './AddNote';

class NotesList extends Component {
  state = {
    editingId: ''
  };

  toggleEditing = noteId => {
    // note is already editing - exit editing mode
    if (this.state.editingId === noteId) {
      this.setState({ editingId: '' });
    } else {
      // enter editing mode
      this.setState({ editingId: noteId });
    }
  };

  render() {
    const { allNoteItems } = this.props.viewer;
    return (
      <Fragment>
        <h1>Notes</h1>
        {allNoteItems.edges.map(({ node }) => (
          <Note
            isEditing={this.state.editingId === node.id}
            toggleEditing={this.toggleEditing}
            key={node.id}
            note={node}
            viewerId={this.props.viewer.id}
          />
        ))}
        <AddNote viewerId={this.props.viewer.id} />
      </Fragment>
    );
  }
}

export default createFragmentContainer(
  NotesList,
  graphql`
    fragment NotesList_viewer on Viewer {
      id
      allNoteItems(last: 100, orderBy: createdAt_ASC)
        @connection(key: "NotesList_allNoteItems", filters: []) {
        edges {
          node {
            id
            ...Note_note
          }
        }
      }
    }
  `
);
