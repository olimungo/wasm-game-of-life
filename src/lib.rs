mod utils;

use core::f64::consts::PI;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate js_sys;

extern crate fixedbitset;
use fixedbitset::FixedBitSet;

extern crate web_sys;
use web_sys::window;
// use web_sys::console;
use web_sys::CanvasRenderingContext2d;
use web_sys::HtmlCanvasElement;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static DEAD_COLOR: &str = "#242c37";
static ALIVE_COLOR: &str = "#4fe4c1";

// macro_rules! log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t )* ).into());
//     }
// }

// pub struct Timer<'a> {
//     name: &'a str,
// }

// impl<'a> Timer<'a> {
//     pub fn new(name: &'a str) -> Timer<'a> {
//         console::time_with_label(name);
//         Timer { name }
//     }
// }

// impl<'a> Drop for Timer<'a> {
//     fn drop(&mut self) {
//         console::time_end_with_label(self.name);
//     }
// }

struct UpdatedCell((u32, u32), bool);

#[wasm_bindgen]
pub struct Universe {
    row_count: u32,
    column_count: u32,
    cell_size: u32,
    colony: FixedBitSet,
    tick_colony: FixedBitSet,
    updated_cells: Vec<UpdatedCell>,
    canvas: Option<CanvasRenderingContext2d>
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    pub fn new(row_count: u32, column_count: u32, cell_size: u32) -> Universe {
        utils::set_panic_hook();
        
        let mut canvas: Option<CanvasRenderingContext2d> = None;
        let document = window().unwrap().document().unwrap();
        let option_element = document.get_element_by_id("ui-canvas");

        // When testing, there's no index.html page containing the canvas element with ui-canvas as id
        if let Some(element) = option_element {
            let html_canvas_element: HtmlCanvasElement = element.dyn_into().unwrap();
            let context_object = html_canvas_element.get_context("2d").unwrap().unwrap();
            canvas = Some(context_object.dyn_into().unwrap());
        }

        let size = (row_count * column_count) as usize;
        let colony = FixedBitSet::with_capacity(size);
        let tick_colony = FixedBitSet::with_capacity(size);
        let updated_cells : Vec<UpdatedCell> = Vec::new();

        Universe {
            row_count,
            column_count,
            cell_size,
            colony,
            tick_colony,
            updated_cells,
            canvas
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
            self.tick_colony.clone_from(&self.colony);
            self.updated_cells.clear();

            for row in 0..self.row_count {
                for column in 0..self.column_count {
                    let index = self.get_index(row, column);
                    let previous_state = self.colony[index];
                    let count = self.live_neighbour_count(row, column);

                    let new_state = match (count, previous_state) {
                        (2, true) | (3, _) => true,
                        _ => false
                    };

                    self.tick_colony.set(index, new_state);

                    // If we process more than 1 generation, we can't rely on the updated cells
                    if generations == 1 && previous_state != new_state {                        
                        self.updated_cells.push(UpdatedCell((row, column), new_state));
                    }
                }
            }

            self.colony.clone_from(&self.tick_colony);
        }
    }

    pub fn draw_cell(&mut self, row: u32, column: u32) {        
        let index = self.get_index(row, column);
        let state = !self.colony[index];
        
        self.colony.set(index, state);

        if let Some(canvas) = &self.canvas {
            let cell_size = self.cell_size as f64;
            let mut radius = cell_size / 2f64;

            if state {
                canvas.set_fill_style(&ALIVE_COLOR.into());

                radius = match radius > 2f64 {
                    true => radius - 1f64,
                    _ => 1f64
                };
            } else {
                canvas.set_fill_style(&DEAD_COLOR.into());
            }

            self.draw_shape(canvas, row as f64, column as f64, cell_size, radius);
            
            canvas.close_path();        
        }
    }

    pub fn set_cell(&mut self, row: u32, column: u32) {
        let index = self.get_index(row, column);
        let state = !self.colony[index];

        self.colony.set(index, state);
    }

    pub fn draw_all_cells(&self) {
        if let Some(canvas) = &self.canvas {
            let cell_size = self.cell_size as f64;
            let mut radius = cell_size / 2f64;

            radius = match radius > 2f64 {
                true => radius - 1f64,
                _ => 1f64
            };

            canvas.begin_path();

            // Erase canvas
            canvas.set_fill_style(&DEAD_COLOR.into());
            canvas.fill_rect(0f64, 0f64, self.column_count as f64 * cell_size, self.row_count as f64 * cell_size);
            
            // Fill canvas with live cells
            canvas.set_fill_style(&ALIVE_COLOR.into());

            for row in 0..self.row_count {
                for column in 0..self.column_count {
                    let index = self.get_index(row, column);

                    if !self.colony[index] {
                        continue;
                    }

                    self.draw_shape(canvas, row as f64, column as f64, cell_size, radius);
                }
            }

            canvas.close_path();
        }
    }

    pub fn draw_updated_cells(&self) {
        self.draw_updated_cells_by_state(true);
        self.draw_updated_cells_by_state(false);
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
        let size = (self.row_count * self.column_count) as usize;
        self.colony.clear();

        for i in 0..size {
            if randomly {
                    self.colony.set(i, js_sys::Math::random() < 0.5);
            } else {
                    self.colony.set(i, i % 2 == 0 || i % 7 == 0);
            }
        }
    }

    fn draw_updated_cells_by_state(&self, state: bool) {
        if let Some(canvas) = &self.canvas {
            let cell_size = self.cell_size as f64;
            let mut radius = cell_size / 2f64;

            canvas.begin_path();
            
            if state {
                canvas.set_fill_style(&ALIVE_COLOR.into());

                radius = match radius > 2f64 {
                    true => radius - 1f64,
                    _ => 1f64
                };
            } else {
                canvas.set_fill_style(&DEAD_COLOR.into());
            }
            
            for index in 0..self.updated_cells.len() {
                let (row, column) = self.updated_cells[index].0;
                let updated_state = self.updated_cells[index].1;

                if updated_state != state {
                    continue;
                }

                self.draw_shape(canvas, row as f64, column as f64, cell_size, radius);
            }

            canvas.close_path();
        }
    }

    fn live_neighbour_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;

        let north = if row == 0 {
            self.row_count - 1
        } else {
            row - 1
        };

        let south = if row == self.row_count - 1 {
            0
        } else {
            row + 1
        };

        let west = if column == 0 {
            self.column_count - 1
        } else {
            column - 1
        };

        let east = if column == self.column_count - 1 {
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

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.column_count + column) as usize
    }

    fn draw_shape(&self, canvas: &CanvasRenderingContext2d, row:f64,column:f64, cell_size:f64, radius:f64 ){
        if cell_size < 4f64 {
            canvas.fill_rect(
                column as f64 * cell_size,
                row as f64 * cell_size,
                cell_size,
                cell_size
            );
        } else {
            canvas.begin_path();

            let _result = canvas.arc(
                column as f64 * cell_size + cell_size / 2f64,
                row as f64 * cell_size + cell_size / 2f64,
                radius,
                0f64,
                2f64 * PI
            );

            canvas.fill();
        }
    }
}
