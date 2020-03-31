import { getCanvasElement, getWebGL2Context, createShader, createProgram, createVertexBuffer, bindAttributeToVertexBuffer, createIndexBuffer, magic } from "./utils/gl-utils.js"
import { vertexShaderSourceCode, fragmentShaderSourceCode } from "./utils/shaders.js"

// #️⃣ Configuración base de WebGL

// Encontramos el canvas y obtenemos su contexto de WebGL
const canvas = getCanvasElement('canvas')
const gl = getWebGL2Context(canvas)

// Seteamos el color que vamos a usar para 'limpiar' el canvas (i.e. el color de fondo)
gl.clearColor(0, 0, 0, 1)

// #️⃣ Creamos los shaders, el programa que vamos a usar, y guardamos info de sus atributos

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)

const program = createProgram(gl, vertexShader, fragmentShader)

const vertexPositionLocation = gl.getAttribLocation(program, 'vertexPosition')
const vertexColorLocation = gl.getAttribLocation(program, 'vertexColor')

// #️⃣ Definimos la info de la geometría que vamos a dibujar (un cubo)

const vertexPositions = [
  -1, 1, 1,   // 0 👈 indice de cada posición
  1, 1, 1,    // 1
  1, 1, -1,   // 2
  -1, 1, -1,  // 3
  -1, -1, 1,  // 4
  1, -1, 1,   // 5
  1, -1, -1,  // 6
  -1, -1, -1  // 7
]

const vertexColors = [
  1, 0, 1,    // 0 👈 indice de cada color
  1, 1, 1,    // 1
  0, 1, 1,    // 2
  0, 0, 1,    // 3
  1, 0, 0,    // 4
  1, 1, 0,    // 5
  0, 1, 0,    // 6
  0, 0, 0     // 7
]

const indices = [
  // cara de arriba
  0, 1, 3,
  3, 1, 2,
  // abajo
  7, 5, 4,
  5, 7, 6,
  // izquierda
  3, 4, 0,
  3, 7, 4,
  // derecha
  5, 2, 1,
  5, 6, 2,
  // adelante
  4, 1, 0,
  4, 5, 1,
  // atrás
  6, 3, 2,
  6, 7, 3,
]

/* 📝 Cada cara esta formada por dos triángulos, donde sus indices siguen la convención de sentido
 * anti-horario 🔄
 */

// #️⃣ Guardamos la info de la geometría en VBOs e IBOs

const vertexPositionsBuffer = createVertexBuffer(gl, vertexPositions)
const vertexColorsBuffer = createVertexBuffer(gl, vertexColors)
const indexBuffer = createIndexBuffer(gl, indices)

// #️⃣ Asociamos los atributos del programa a los buffers creados, y establecemos el buffer de indices a usar

// Creamos un Vertex Array Object (VAO)
const vertexArray = gl.createVertexArray()

// A partir de aca, el VAO registra cada atributo habilitado y su conexión con un buffer, junto con los indices
gl.bindVertexArray(vertexArray)

// Habilitamos cada atributo y lo conectamos a su buffer
gl.enableVertexAttribArray(vertexPositionLocation)
bindAttributeToVertexBuffer(gl, vertexPositionLocation, 3, vertexPositionsBuffer)
gl.enableVertexAttribArray(vertexColorLocation)
bindAttributeToVertexBuffer(gl, vertexColorLocation, 3, vertexColorsBuffer)

// Conectamos el buffer de indices que vamos a usar
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

// Dejamos de tomar nota en el VAO
gl.bindVertexArray(null)

// #️⃣ Establecemos el programa a usar, sus conexiónes atributo-buffer e indices a usar (guardado en el VAO)

gl.useProgram(program)
gl.bindVertexArray(vertexArray)

// ✨ Magia (que mas adelante vamos a ver qué esta haciendo)
magic(gl, program, canvas)

// #️⃣ Dibujamos la escena

// Limpiamos el canvas
gl.clear(gl.COLOR_BUFFER_BIT)

// Y dibujamos 🎨
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
