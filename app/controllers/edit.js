import Ember from 'ember';

export default Ember.Controller.extend({
  leftPanelVisible: true,
  rightPanelVisible: true,
  queryParams: ['leftPanelVisible', 'rightPanelVisible'],

  itsSaved: Ember.computed("model.hasDirtyAttributes", function() {
    return (!this.get("model.hasDirtyAttributes"));
  }),

  enableShortcuts() {
    window.addEventListener('keydown', this.onKeyDown.bind(this), true);
  },

  disableShortcuts() {
    window.removeEventListener('keydown', this.onKeyDown.bind(this), true);
  },

  discartModelChanges() {
    var model = this.get('model');

    if (model.get('hasDirtyAttributes')) {
      model.rollbackAttributes();
    }
  },

  onKeyDown(e) {
    if (e.metaKey) {
      if (e.which === 83 || e.which === 13) {
        e.preventDefault();
        this.transitionToRoute("edit.previewModal", this.get('model'));
      }
    }
  },

  actions: {
    save(project) {
      project.save();
    },
    reload(project) {
      this.get("xResultHandler").send('run', project);
    }
  }
});
