class MyNotes {
  constructor() {
    /*
    this.deleteButton = document.querySelectorAll('.delete-note');
    this.editButton = document.querySelectorAll('.edit-note');
    this.updateButton = document.querySelectorAll('.update-note');
    this.submitButton = document.querySelectorAll('.submit-note');
    */
    this.myNotes = document.querySelector('#my-notes');
    this.events();
  }

  events() {
    this.myNotes.addEventListener('click', e => this.clickHandler(e));
    document.querySelector('.submit-note').addEventListener('click', () => this.createNote());

    /*
    this.deleteButton.forEach(btn => {
      btn.addEventListener('click', e => {
        this.deleteNote(e);
      });
    });

    this.editButton.forEach(btn => {
      btn.addEventListener('click', e => {
        this.editNote(e);
      });
    });

    this.updateButton.forEach(btn => {
      btn.addEventListener('click', e => {
        this.updateNote(e);
      });
    });

    this.submitButton.forEach(btn => {
      btn.addEventListener('click', e => {
        this.createNote(e);
      });
    });
    */
  }

  clickHandler(e) {
    if (e.target.classList.contains('delete-note') || e.target.classList.contains('fa-trash-o')) this.deleteNote(e);
    if (
      e.target.classList.contains('edit-note') ||
      e.target.classList.contains('fa-pencil') ||
      e.target.classList.contains('fa-times')
    )
      this.editNote(e);
    if (e.target.classList.contains('update-note') || e.target.classList.contains('fa-arrow-right')) this.updateNote(e);
  }

  editNote(e) {
    const thisNote = e.target.parentElement;
    if (thisNote.getAttribute('data-state') == 'editable') {
      this.makeNoteReadOnly(thisNote);
    } else {
      this.makeNoteEditable(thisNote);
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.querySelector('.edit-note').innerHTML = `
      <i class="fa fa-times" aria-hidden="true"></i> Cancel
    `;
    thisNote.querySelector('.note-title-field').removeAttribute('readonly');
    thisNote.querySelector('.note-title-field').classList.add('note-active-field');
    thisNote.querySelector('.note-body-field').removeAttribute('readonly');
    thisNote.querySelector('.note-body-field').classList.add('note-active-field');
    thisNote.querySelector('.update-note').classList.add('update-note--visible');
    thisNote.setAttribute('data-state', 'editable');
  }

  makeNoteReadOnly(thisNote) {
    thisNote.querySelector('.edit-note').innerHTML = `
      <i class="fa fa-pencil" aria-hidden="true"></i> Edit
    `;
    thisNote.querySelector('.note-title-field').setAttribute('readonly', 'readonly');
    thisNote.querySelector('.note-title-field').classList.remove('note-active-field');
    thisNote.querySelector('.note-body-field').setAttribute('readonly', 'readonly');
    thisNote.querySelector('.note-body-field').classList.remove('note-active-field');
    thisNote.querySelector('.update-note').classList.remove('update-note--visible');
    thisNote.setAttribute('data-state', 'cancel');
  }

  async deleteNote(e) {
    const thisNote = e.target.parentElement;

    try {
      const response = await fetch(
        universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.getAttribute('data-id'),
        {
          headers: {
            'X-WP-Nonce': universityData.nonce,
          },
          method: 'DELETE',
        }
      );
      const result = await response.json();
      console.log(result);
      thisNote.remove();
    } catch (e) {
      console.log(e);
    }
  }

  async updateNote(e) {
    const thisNote = e.target.parentElement;

    var ourUpdatedPost = {
      title: thisNote.querySelector('.note-title-field').value,
      content: thisNote.querySelector('.note-body-field').value,
    };

    console.log(JSON.stringify(ourUpdatedPost));

    try {
      const response = await fetch(
        universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.getAttribute('data-id'),
        {
          headers: {
            'X-WP-Nonce': universityData.nonce,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(ourUpdatedPost),
        }
      );
      const result = await response.json();
      console.log(result.title);
      this.makeNoteReadOnly(thisNote);
    } catch (e) {
      console.log(e);
    }
  }

  async createNote(e) {
    var ourNewPost = {
      title: document.querySelector('.new-note-title').value,
      content: document.querySelector('.new-note-body').value,
      status: 'publish',
    };

    try {
      const response = await fetch(universityData.root_url + '/wp-json/wp/v2/note/', {
        headers: {
          'X-WP-Nonce': universityData.nonce,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(ourNewPost),
      });
      const result = await response.json();
      document.querySelector('.new-note-title').value = '';
      document.querySelector('.new-note-body').value = '';

      document.querySelector('#my-notes').insertAdjacentHTML(
        'afterbegin',
        `
        <li data-id="${result.id}">
          <input readonly class="note-title-field" value="${result.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field">${result.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>
        </li>

      `
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export default MyNotes;
