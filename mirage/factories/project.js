import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  title(i) {
    return `demo ${i}`;
  },
  ancho: 320,
  alto: 240,

  code(i) {
      return `var patito = pilas.actores.patito();
`;
    },

});
