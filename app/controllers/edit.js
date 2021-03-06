import Ember from 'ember';

export default Ember.Controller.extend({
  leftPanelVisible: true,
  centerPanelVisible: true,
  editorPanelVisible: true,
  showConsole: false,
  queryParams: ['leftPanelVisible', 'centerPanelVisible', 'editorPanelVisible', 'showConsole'],
  editorFactory: Ember.inject.service(),
  pilasService: Ember.inject.service('pilas'),

  loadingPilas: false,
  currentOption: "Inspector",
  options: ["Inspector", "Manual"],

  itsSaved: Ember.computed("model.hasDirtyAttributes", function() {
    return (!this.get("model.hasDirtyAttributes"));
  }),

  allPanelsInvisible: Ember.computed("leftPanelVisible", "centerPanelVisible", "editorPanelVisible", function() {
    return (
      !this.get("leftPanelVisible") &&
      !this.get("centerPanelVisible") &&
      !this.get("editorPanelVisible")
    );
  }),

  custom_eval_function(code) {
    var out = {};

    let iframeElement = $("iframe#innerIframe")[0];

    try {
      out.completionValue = iframeElement.contentWindow.eval.call(null, code);
    } catch(e) {
      out.error = true;
      out.completionValue = e.message;
      out.recoverable = (e instanceof SyntaxError && e.message.match('^Unexpected (token|end)'));
    }

    return out;
  },

  custom_autocomplete_function(cm) {
    let end = cm.getCursor().ch;
    let full_line = cm.getValue().substr(0, end);
    let start = full_line.lastIndexOf(" ");

    if (start === -1) {
      start = 0;
    }

    let currentWord = full_line.substr(start, end - start);

    //tests/dummy/app/controllers/application.js

    let iframeElement = $("iframe#innerIframe")[0];
    //let currentWord = cm.getTokenAt(cm.getCursor()).string;

    let code = `pilas.utils.autocompletar('${currentWord}')`;

    let result = iframeElement.contentWindow.eval.call(null, code);
    let endCursor = CodeMirror.Pos(cm.getCursor().line, cm.getCursor().ch - currentWord.length);

    return {from: cm.getCursor(), to: endCursor, list: result};
  },

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
    var editorFactory = this.get("editorFactory");
    var that = this;

    if (e.metaKey) {
      if (e.which === 83 /* S */ || e.which === 13 /* ENTER */) {
        e.preventDefault();

        that.send('reload', that.get('model'));

        this.get('model').save().then(() => {

          setTimeout(() => {editorFactory.tryToFocus();}, 500);
          setTimeout(() => {editorFactory.tryToFocus();}, 1000);

        });

      }
    }
  },

  saveProjectAndRun(project) {
    return new Ember.RSVP.Promise((success) => {
      project.save().then(() => {
        this.get("pilasService").runProject(project);
        success();
      });
    });
  },

  actions: {
    saveAndReload(project) {
      this.set("loadingPilas", true);

      this.saveProjectAndRun(project).then(() => {
        this.set("loadingPilas", false);
      });
    },
    onReady(/*pilas*/) {
      this.set("loadingPilas", false);
    },
    reload(project) {
      this.set("loadingPilas", true);

      this.saveProjectAndRun(project).then(() => {
        this.set("loadingPilas", false);
      });
    }
  }
});
