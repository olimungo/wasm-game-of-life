mod utils;

use wasm_bindgen::prelude::*;

extern crate js_sys;

extern crate fixedbitset;
use fixedbitset::FixedBitSet;

extern crate web_sys;
use web_sys::console;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// macro_rules! log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t )* ).into());
//     }
// }

pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) {
        console::time_end_with_label(self.name);
    }
}

struct UpdatedCell((u32, u32), bool);

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    colony: FixedBitSet,
    updated_cells: Vec<UpdatedCell>
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        utils::set_panic_hook();

        let size = (width * height) as usize;
        let colony = FixedBitSet::with_capacity(size);
        let updated_cells : Vec<UpdatedCell> = Vec::new();

        Universe {
            width,
            height,
            colony,
            updated_cells,
        }
    }

    pub fn generate_pattern_colony(&mut self) {
        self.generate_colony(false);
    }
    
    pub fn generate_random_colony(&mut self) {
        self.generate_colony(true);
    }

    pub fn tick(&mut self, generations: u32) {
        for _ in 0..generations {
            let mut colony = self.colony.clone();
            let mut updated_cells : Vec<UpdatedCell>= Vec::new();

            for row in 0..self.height {
                for col in 0..self.width {
                    let index = self.get_index(row, col);
                    let previous_state = self.colony[index];
                    let count = self.live_neighbour_count(row, col);

                    let new_state = match (count, previous_state) {
                        (2, true) | (3, _) => true,
                        _ => false
                    };

                    colony.set(index, new_state);

                    // If we process more than 1 generation, we can't rely on the updated cells
                    if generations == 1 && previous_state != new_state {
                        updated_cells.push(UpdatedCell((row, col), new_state));
                    }
                }
            }

            self.colony = colony;
            self.updated_cells = updated_cells;
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn colony(&self) -> *const u32 {
        self.colony.as_slice().as_ptr()
    }
    
    pub fn updated_cells_length(&self) -> usize {
        self.updated_cells.len()
    }

    pub fn updated_cells_rows(&self) -> *const u32 {
        let mut rows: Vec<u32> = Vec::new();

        for index in 0..self.updated_cells.len() {
            let (row, _) = self.updated_cells[index].0;
            rows.push(row);
        }

        rows.as_ptr()
    }

    pub fn updated_cells_columns(&self) -> *const u32 {
        let mut columns: Vec<u32> = Vec::new();

        for index in 0..self.updated_cells.len() {
            let (_, col) = self.updated_cells[index].0;
            columns.push(col);
        }

        columns.as_ptr()
    }

    pub fn updated_cells_states(&self) -> *const u32 {
        let mut states: Vec<u32> = Vec::new();

        for index in 0..self.updated_cells.len() {
            let state = self.updated_cells[index].1;

            states.push(match state {
                true => 1,
                _ => 0
            });
        }

        states.as_ptr()
    }
}

// Private methods called from Rust only
impl Universe {
    // Get the dead and alive values of the entire universe.
    pub fn get_colony(&self) -> &FixedBitSet {
        &self.colony
    }

    // Set cells to be alive in a universe by passing the row and column
    // of each cell as an array.
    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, column) in cells.iter().cloned() {
            let index = self.get_index(row, column);
            self.colony.set(index, true);
        }
    }

    pub fn generate_colony(&mut self, randomly: bool) {
        let size = (self.width * self.height) as usize;
        let mut colony = FixedBitSet::with_capacity(size);

        for i in 0..size {
            if randomly {
                    colony.set(i, if js_sys::Math::random() < 0.5 { true } else { false });
            } else {
                    colony.set(i, i % 2 == 0 || i % 7 == 0);
            }
        }

        self.colony = colony;
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbour_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;

        let north = if row == 0 {
            self.height - 1
        } else {
            row - 1
        };

        let south = if row == self.height - 1 {
            0
        } else {
            row + 1
        };

        let west = if column == 0 {
            self.width - 1
        } else {
            column - 1
        };

        let east = if column == self.width - 1 {
            0
        } else {
            column + 1
        };

        let nw = self.get_index(north, west);
        count += self.colony[nw] as u8;

        let n = self.get_index(north, column);
        count += self.colony[n] as u8;

        let ne = self.get_index(north, east);
        count += self.colony[ne] as u8;

        let w = self.get_index(row, west);
        count += self.colony[w] as u8;

        let e = self.get_index(row, east);
        count += self.colony[e] as u8;

        let sw = self.get_index(south, west);
        count += self.colony[sw] as u8;

        let s = self.get_index(south, column);
        count += self.colony[s] as u8;

        let se = self.get_index(south, east);
        count += self.colony[se] as u8;

        count
    }
}
