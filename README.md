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
Use wasm-build to transpile the Rust code to WebAssembly. This command has to be executed when the _lib.rs_ file is modified and right after cloning the repository.

This command has to be executed in the root folder of the project:

```shell
wasm-pack build
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

## Redraw the canvas

At each generation (tick), the colony is redrawn. This is done purely in JavaScript.

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
