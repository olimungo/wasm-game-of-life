//! Test suite for the Web and headless browsers.
#![cfg(target_arch = "wasm32")]

extern crate wasm_game_of_life;

use wasm_game_of_life::Universe;

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

pub enum ColonyExample {
    SpaceshipInput,
    SpaceshipExpected,
    BlinkerInput,
    BlinkerExpected,
    BorderInput,
    BorderExpected,
    PatternExpected
}

#[cfg(test)]
pub fn input_factory(colony_example: ColonyExample) -> Universe {
    let (width, height) = match colony_example {
        ColonyExample::SpaceshipInput | ColonyExample::SpaceshipExpected => (6, 6),
        ColonyExample::BlinkerInput | ColonyExample::BlinkerExpected => (5, 5),
        ColonyExample::BorderInput | ColonyExample::BorderExpected => (4, 4),
        ColonyExample::PatternExpected => (3, 3)
    };
    
    let mut universe = Universe::new(width, height, 1);

    match colony_example {
        ColonyExample::SpaceshipInput => universe.set_cells(&[(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]),
        ColonyExample::SpaceshipExpected => universe.set_cells(&[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]),
        ColonyExample::BlinkerInput => universe.set_cells(&[(2, 1), (2, 2), (2, 3)]),
        ColonyExample::BlinkerExpected => universe.set_cells(&[(1, 2), (2, 2), (3, 2)]),
        ColonyExample::BorderInput => universe.set_cells(&[(1, 0), (1, 3), (2, 3)]),
        ColonyExample::BorderExpected => universe.set_cells(&[(1, 0), (1, 3), (2, 0), (2, 3)]),
        ColonyExample::PatternExpected => universe.set_cells(&[]),
    };

    universe
}

#[wasm_bindgen_test]
pub fn test_tick_spaceship() {
    let mut input_universe = input_factory(ColonyExample::SpaceshipInput);
    let expected_universe = input_factory(ColonyExample::SpaceshipExpected);

    input_universe.tick(1);
    
    assert_eq!(&input_universe.get_colony(), &expected_universe.get_colony());
}

#[wasm_bindgen_test]
pub fn test_tick_blinker() {
    let mut input_universe = input_factory(ColonyExample::BlinkerInput);
    
    let expected_universe = input_factory(ColonyExample::BlinkerExpected);

    input_universe.tick(1);

    assert_eq!(&input_universe.get_colony(), &expected_universe.get_colony());
}

#[wasm_bindgen_test]
pub fn test_tick_border() {
    let mut input_universe = input_factory(ColonyExample::BorderInput);
    let expected_universe = input_factory(ColonyExample::BorderExpected);

    input_universe.tick(1);

    assert_eq!(&input_universe.get_colony(), &expected_universe.get_colony());
}

#[wasm_bindgen_test]
pub fn test_generate_pattern() {
    let mut input_universe = Universe::new(3, 3, 1);
    input_universe.generate_pattern_colony();

    let expected_universe = input_factory(ColonyExample::PatternExpected);

    input_universe.tick(1);

    assert_eq!(&input_universe.get_colony(), &expected_universe.get_colony());
}
