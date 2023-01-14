mod utils;

use wasm_bindgen::prelude::*;

extern crate js_sys;
extern crate fixedbitset;
use fixedbitset::FixedBitSet;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

struct UpdatedCell((u32, u32), bool);

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
    updated_cells: Vec<UpdatedCell>
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32, randomly: bool) -> Universe {
        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);
        let updated_cells : Vec<UpdatedCell> = Vec::new();

        if randomly {
            for i in 0..size {
                cells.set(i, if js_sys::Math::random() < 0.5 { true } else { false });
            }
        
        } else {
            for i in 0..size {
                cells.set(i, i % 2 == 0 || i % 7 == 0);
            }
        }
    
        Universe {
            width,
            height,
            cells,
            updated_cells,
        }
    }

    pub fn tick(&mut self, generations: u32) {
        for _ in 0..generations {
            let mut new_cells = self.cells.clone();
            let mut updated_cells : Vec<UpdatedCell>= Vec::new();

            for row in 0..self.height {
                for col in 0..self.width {
                    let index = self.get_index(row, col);
                    let previous_state = self.cells[index];
                    let live_neighbour_count = self.live_neighbour_count(row, col);

                    let new_state = match (live_neighbour_count, previous_state) {
                        (2, true) | (3, _) => true,
                        _ => false
                    };

                    new_cells.set(index, new_state);

                    if previous_state != new_state {
                        updated_cells.push(UpdatedCell((row, col), new_state));
                    }
                }
            }

            self.cells = new_cells;
            self.updated_cells = updated_cells;
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
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
        let mut cols: Vec<u32> = Vec::new();

        for index in 0..self.updated_cells.len() {
            let (_, col) = self.updated_cells[index].0;
            cols.push(col);
        }

        cols.as_ptr()
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

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbour_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;

        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);

                count += self.cells[idx] as u8;
            }
        }

        count
    }
}
