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

#[wasm_bindgen]
pub struct ChangedCell((u32, u32), bool);

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
    changed_cells: Vec<ChangedCell>
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);
        let changed_cells : Vec<ChangedCell> = Vec::new();
        // let changed_cells: Vec<ChangedCell> = vec![ChangedCell((1, 2), true), ChangedCell((3, 4), false)];
    
        for i in 0..size {
            cells.set(i, i % 2 == 0 || i % 7 == 0);
        }

        // for i in 0..size {
        //     cells.set(i, if js_sys::Math::random() < 0.5 { true } else { false });
        // }
    
        Universe {
            width,
            height,
            cells,
            changed_cells,
        }
    }

    pub fn tick(&mut self, iterations: u32) {
        for _ in 0..iterations {
            let mut new_cells = self.cells.clone();
            let mut changed_cells : Vec<ChangedCell>= Vec::new();

            for row in 0..self.height {
                for col in 0..self.width {
                    let index = self.get_index(row, col);
                    let state = self.cells[index];
                    let live_neighbour_count = self.live_neighbour_count(row, col);

                    new_cells.set(index, match (live_neighbour_count, state) {
                        (2, true) | (3, _) => true,
                        _ => false
                    });

                    if state != new_cells[index] {
                        changed_cells.push(ChangedCell ((row, col), new_cells[index]));
                    }
                }
            }

            self.cells = new_cells;
            self.changed_cells = changed_cells;
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
    
    pub fn changed_cells_len(&self) -> usize {
        self.changed_cells.len()
    }

    pub fn changed_cells_rows(&self) -> *const u32 {
        let mut rows: Vec<u32> = Vec::new();

        for index in 0..self.changed_cells.len() {
            let (row, _) = self.changed_cells[index].0;
            rows.push(row);
        }

        rows.as_ptr()
    }

    pub fn changed_cells_cols(&self) -> *const u32 {
        let mut cols: Vec<u32> = Vec::new();

        for index in 0..self.changed_cells.len() {
            let (_, col) = self.changed_cells[index].0;
            cols.push(col);
        }

        cols.as_ptr()
    }

    pub fn changed_cells_states(&self) -> *const u32 {
        let mut states: Vec<u32> = Vec::new();

        for index in 0..self.changed_cells.len() {
            let state = self.changed_cells[index].1;

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
