# GAME OF LIFE

This project is about comparing WebAssembly to JavaScript.
The Game of life was implemented both in Rust (transpiled to WebAssembly) and JavaScript.

Inspired by: https://rustwasm.github.io/docs/book/introduction.html
and https://rosettacode.org/wiki/Conway%27s_Game_of_Life#Rust

## Required tools

-   [`Rust`](https://www.rust-lang.org/tools/install) toolchain, including rustup, rustc, and cargo.
-   [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/) building, testing, and publishing Rust-generated WebAssembly.
-   [`node and npm`](https://nodejs.org/): **_make sure to use version 16_**
-   cargo-generate helps you get up and running quickly with a new Rust project by leveraging a pre-existing git repository as a template.

Use this command to install cargo-generate:

```shell
cargo install cargo-generate
```

## Rust

The Rust code can be found into the _src_ folder (file: _lib.rs_).
Use wasm-pack to transpile the Rust code to WebAssembly. This command has to be executed when the _lib.rs_ file is modified and right after cloning the repository.

This command has to be executed in the root folder of the project:

```shell
wasm-pack build
```

For being able to see the Rust functions name executed in the JavaScript profiler of your browser, do a build with the --dev option and debug symbols will be added:

```shell
wasm-pack build --dev
```

### Tests

```shell
wasm-pack test --chrome --headless
```

## JavaScript

The JavaScript code for the front-end as well as for the implementation of the Game of life can be found into the _www_ folder.

The entry file is _index.js_. The implementation of the game is located into the _game-of-life-javascript.js_ file. The file _game-of-life-wasm.js_ is a wrapper for calling the WebAssembly executable.

After the first clone of the repository, move to the _www_ folder and install the dependencies:

```shell
npm i
```

When all dependencies are installed, a server can be fire up:

```shell
npm start
```

The app will be available at http://localhost:8080.

## Redrawing the canvas

At each generation (tick), the colony is redrawn on the canvas.
If the _number of generations_ is:

-   exactly equal to 1, then only the updated cells are redrawn,
-   if it's higher than 1, then the colony is fully redrawn.

:warning: When benchmarking, do not PAUSE the game or change tab in your browser. It will mess with the timing. :warning:

## Conclusions

Implementations of the Game of Life in Rust and JavaScript are identical (taking into account each langague specificity).

The Rust code draws directly onto the canvas and as of January 2023, the performances are similar :open_mouth:

Where Rust (or more precisely WebAssembly) is more efficicent is on large Universes, when computing is more intensive. Like in the tick function when the number of generations at once is big enough. A good test is a Universe of 702\*820 and a number of generations at once of 100. When I run it for 2000 generations, I get the following results with WebAssembly:

-   Average duration per tick: 22.84 ms
-   Average duration per redraw: 4.65 ms

and with JavaScript:

-   Average duration per tick: 33.17 ms
-   Average duration per redraw: 4.40 ms

## License

Licensed under either of

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally
submitted for inclusion in the work by you, as defined in the Apache-2.0
license, shall be dual licensed as above, without any additional terms or
conditions.
