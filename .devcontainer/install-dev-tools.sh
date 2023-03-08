curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
cargo install cargo-generate
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
wasm-pack build
cd www
npm i
npm start
