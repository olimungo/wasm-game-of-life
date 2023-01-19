mod utils;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate js_sys;

extern crate fixedbitset;
use fixedbitset::FixedBitSet;

extern crate web_sys;
use web_sys::window;
use web_sys::CanvasRenderingContext2d;
use web_sys::HtmlCanvasElement;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static COLOR_CELL_ALIVE: &str = "#000000";
static COLOR_CELL_DEAD: &str = "#ffffff";

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
    width: u32,
    height: u32,
    cell_size: u32,
    colony: FixedBitSet,
    updated_cells: Vec<UpdatedCell>,
    canvas: Option<CanvasRenderingContext2d>
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32, cell_size: u32) -> Universe {
        utils::set_panic_hook();
        
        let mut canvas: Option<CanvasRenderingContext2d> = None;
        let document = window().unwrap().document().unwrap();
        let element = document.get_element_by_id("ui-canvas");

        // When testing, there's no index.html page containing the div element with ui-canvas as id
        if let Some(_) = element {
            let html_canvas_element: HtmlCanvasElement = element.unwrap().dyn_into().unwrap();
            let context_object = html_canvas_element.get_context("2d").unwrap().unwrap();
            canvas = Some(context_object.dyn_into().unwrap());
        }

        let size = (width * height) as usize;
        let colony = FixedBitSet::with_capacity(size);
        let updated_cells : Vec<UpdatedCell> = Vec::new();

        Universe {
            width,
            height,
            cell_size,
            colony,
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
            let mut colony = self.colony.clone();
            let mut updated_cells : Vec<UpdatedCell>= Vec::new();

            for row in 0..self.height {
                for column in 0..self.width {
                    let index = self.get_index(row, column);
                    let previous_state = self.colony[index];
                    let count = self.live_neighbour_count(row, column);

                    let new_state = match (count, previous_state) {
                        (2, true) | (3, _) => true,
                        _ => false
                    };

                    colony.set(index, new_state);

                    // If we process more than 1 generation, we can't rely on the updated cells
                    if generations == 1 && previous_state != new_state {                        
                        updated_cells.push(UpdatedCell((row, column), new_state));
                    }
                }
            }

            self.colony = colony;
            self.updated_cells = updated_cells;
        }
    }

    pub fn draw_all_cells(&self) {
        if let Some(canvas) = &self.canvas {
            canvas.begin_path();
    
            self.draw_all_cells_by_state(true);
            self.draw_all_cells_by_state(false);  
            
            canvas.stroke();
        }
    }

    pub fn draw_updated_cells(&self) {
        if let Some(canvas) = &self.canvas {
            canvas.begin_path();

            self.draw_updated_cells_by_state(true);
            self.draw_updated_cells_by_state(false);
        
            canvas.stroke();
        }
    }

    pub fn test(&mut self) {
        // self.tick(1u32);

        if let Some(canvas) = &self.canvas {
            // log!("{}", self.colony[0]);
            // log!("{}", self.colony[1]);
            // log!("{}", self.colony[2]);
            // log!("{}", self.colony[3]);
            // log!("{}", self.colony[4]);
            // log!("{}", self.colony[5]);
            // log!("{}", self.colony[6]);
            // log!("{}", self.colony[7]);
            // log!("{}", self.colony[8]);

            // let cell_size = self.cell_size as f64;

            // canvas.clear_rect(0f64, 0f64, self.width as f64 * cell_size, self.height as f64 * cell_size);
            // canvas.set_fill_style(&COLOR_CELL_ALIVE.into());
            
            // canvas.fill_rect(
            //     0f64 * cell_size,
            //     0f64 * cell_size,
            //     150f64 * cell_size,
            //     150f64 * cell_size
            // );

            canvas.stroke();
        }
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

    fn draw_all_cells_by_state(&self, state: bool) {
        if let Some(canvas) = &self.canvas {
            let color: &str;
            let cell_size = self.cell_size as f64;

            if state {
                color = &COLOR_CELL_ALIVE;
            } else {
                color = &COLOR_CELL_DEAD;
            }

            canvas.set_fill_style(&color.into());
            
            for row in 0..self.height {
                for column in 0..self.width {
                    let index = self.get_index(row, column);

                    if self.colony[index] != state {
                        continue;
                    }
                    
                    canvas.fill_rect(
                        column as f64 * cell_size,
                        row as f64 * cell_size,
                        cell_size,
                        cell_size
                    );
                }
            }
        }
    }

    fn draw_updated_cells_by_state(&self, state: bool) {
        if let Some(canvas) = &self.canvas {
            let color: &str;
            let cell_size = self.cell_size as f64;
            
            if state {
                color = &COLOR_CELL_ALIVE;
            } else {
                color = &COLOR_CELL_DEAD;
            }
            
            canvas.set_fill_style(&color.into());
            
            for index in 0..self.updated_cells.len() {
                let (row, column) = self.updated_cells[index].0;
                let updated_state = self.updated_cells[index].1;

                if updated_state != state {
                    continue;
                }

                canvas.fill_rect(
                    column as f64 * cell_size,
                    row as f64 * cell_size,
                    cell_size,
                    cell_size
                );
            }
        }
    }
}
