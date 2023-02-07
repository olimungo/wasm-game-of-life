export const DEFAULT_COLONY_SAMPLE = 2;

export const ColonySamples = Object.freeze({
    Pattern: Symbol('Pattern'),
    Randomly: Symbol('Randomly'),
    Blinker: Symbol('Blinker'),
    Glider: Symbol('Glider'),
    GlidersFactory: Symbol('Gliders factory'),
    GlidersFactory2: Symbol('Gliders factory 2'),
    CoolPattern: Symbol('Cool pattern'),
    GosperGliderGun: Symbol('Gosper glider gun'),
    Gabriel: Symbol("Gabriel's p138"),
    RPentomino: Symbol('R-pentomino'),
    RPentominos: Symbol('R-pentominos'),
    TwoEngineCordership: Symbol('2-engine Cordership'),
    NoahsArk: Symbol("Noah's ark"),
});

export const colonySamples = [
    {
        id: ColonySamples.Pattern,
        label: ColonySamples.Pattern.description,
        rowCount: 150,
        columnCount: 150,
        cellSize: 4,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '',
    },
    {
        id: ColonySamples.Randomly,
        label: ColonySamples.Randomly.description,
        rowCount: 100,
        columnCount: 100,
        cellSize: 5,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '',
    },
    {
        id: ColonySamples.Blinker,
        label: ColonySamples.Blinker.description,
        rowCount: 9,
        columnCount: 9,
        cellSize: 50,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 250,
        colony: 'b3$3b3o!',
    },
    {
        id: ColonySamples.Glider,
        label: ColonySamples.Glider.description,
        rowCount: 100,
        columnCount: 100,
        cellSize: 6,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 100,
        colony: 'b$3b1o$1b1o1b1o$2b2o!',
    },
    {
        id: ColonySamples.GlidersFactory,
        label: ColonySamples.GlidersFactory.description,
        rowCount: 200,
        columnCount: 250,
        cellSize: 4,
        generationsCount: 15000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: 'b34$80bo$78bobo$68b2o6b2o12b2o$67bo3bo4b2o12b2o$56b2o8bo5bo3b2o$56b2o8bo3bob2o4bobo$66bo5bo7bo$67bo3bo$68b2o!',
    },
    {
        id: ColonySamples.GlidersFactory2,
        label: ColonySamples.GlidersFactory2.description,
        rowCount: 600,
        columnCount: 600,
        cellSize: 1,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: 'b570$532bobo$531bo$532bo2bo$534b3o$557b2o$557b2o!',
    },
    {
        id: ColonySamples.CoolPattern,
        label: ColonySamples.CoolPattern.description,
        rowCount: 150,
        columnCount: 180,
        cellSize: 4,
        generationsCount: 1200,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '110$83b1o2b1o$84b2o$82b6o!',
    },
    {
        id: ColonySamples.GosperGliderGun,
        label: ColonySamples.GosperGliderGun.description,
        rowCount: 45,
        columnCount: 150,
        cellSize: 5,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '12$101b4o$101b1o3b1o$101b1o$102b1o21b2o$104b2o18b2o$108b3o5b5o$101b2o3b2o3b1o3b2o1b3o$100b2o1b3o1b1o2b1o4b1o3b1o1b1o$101b9o9b1o1b2o$102b4o10b1o4b1o$121b1o$118b1o1b1o$119b1o$108b6o$108b1o5b1o$108b1o23b3o$109b1o4b1o16b5o$111b2o17b2o1b3o$131b2o!',
    },
    {
        id: ColonySamples.Gabriel,
        label: ColonySamples.Gabriel.description,
        rowCount: 50,
        columnCount: 50,
        cellSize: 8,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '18$24b3o$23b1o2b1o$24b1o3b1o$19b1o5b3o$20b1o5b1o$17b2o1b2o$17b1o2b1o9b1o$17b1o1b1o9b1o1b1o$18b1o9b1o2b1o$27b2o1b2o$22b1o5b1o$21b3o5b1o$20b1o3b1o$22b1o2b1o$22b3o!',
    },
    {
        id: ColonySamples.RPentomino,
        label: ColonySamples.RPentomino.description,
        rowCount: 150,
        columnCount: 150,
        cellSize: 4,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '74$71b2o$70b2o$71b1o!',
    },
    {
        id: ColonySamples.RPentominos,
        label: ColonySamples.RPentominos.description,
        rowCount: 200,
        columnCount: 300,
        cellSize: 4,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: '100$163b2o$162b1o1b1o$162b1o2b1o$163b2o$164b1o$163b2o58b1o$162b1o2b1o56b1o1b2o$162b1o59b1o$163b3o57b1o1b1o$224b1o$163b1o50b1o$162b1o1b2o36b4o6b2o1b1o6b3o$162b1o1b2o37b3o7b2o7b1o1b2o$163b2o39b1o9b1o1b1o6b3o$163b1o37b1o11b1o1b1o$162b1o1b1o37b1o3b1o6b1o8b2o9b1o8b2o$162b1o1b2o37b3o7b3o7b2o1b1o4b2o1b2o6b1o1b2o$163b1o53b1o6b1o9b1o9b1o$217b1o$193b1o$192b1o$183b1o8b1o$162b3o17b1o1b1o7b1o$162b1o1b1o17b1o1b1o$164b1o18b1o2b1o6b3o$62b2o99b1o9b1o$63b2o97b3o7b3o$64b1o99b1o8b1o$63b1o108b1o$62b2o9b1o$61b1o1b1o9b3o26b3o57b3o$64b1o6b1o29b1o2b1o58b1o$62b2o39b1o58b1o$60b1o1b1o$60b1o1b1o51b1o18b1o29b1o$63b1o16b2o1b2o17b2o9b1o9b2o8b1o29b1o$62b2o19b2o18b2o6b1o1b1o7b1o1b1o9b1o28b1o1b1o$62b2o18b1o17b1o1b1o9b1o10b1o7b2o$162b2o$60b2o$60b3o17b2o$63b1o19b2o7b2o8b2o48b3o7b3o$62b2o17b1o1b1o5b1o3b1o7b1o1b1o$62b1o19b1o10b1o5b1o3b1o49b1o7b1o2b1o$89b1o1b1o7b1o52b1o$152b1o9b2o$80b2o1b1o69b1o$81b1o1b1o8b1o60b1o$81b3o6b4o59b1o$89b3o1b1o$89b2o60b3o$79b1o$81b1o1b1o60b1o7b1o$81b3o58b1o1b1o8b2o$82b1o8b3o$89b2o2b1o48b1o9b1o$89b1o52b1o9b1o$142b1o9b1o!',
    },
    {
        id: ColonySamples.TwoEngineCordership,
        label: ColonySamples.TwoEngineCordership.description,
        rowCount: 180,
        columnCount: 180,
        cellSize: 4,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: 'b60$88b2o$88b4o$88bob2o2$89bo$88b2o$88b3o$90bo$102b2o$102b2o7$105bo$104b2o$103bo3bo$104b2o2bo$109bo$106bobo$107bo$107bo$107b2o$107b2o3$82bo10bo$81b5o5bob2o11bo$80bo10bo3bo9bo$81b2o8b3obo9b2o$82b2o9b2o12bo$69b2o13bo21b3o$69b2o35b3o7$77b2o$77b2o11b2o$88b2o2bo$93bo3bo$87bo5bo3bo$88bo2b2o3bobo$89b3o5bo$97bo!',
    },
    {
        id: ColonySamples.NoahsArk,
        label: ColonySamples.NoahsArk.description,
        rowCount: 180,
        columnCount: 180,
        cellSize: 4,
        generationsCount: 5000,
        generationsAtOnce: 1,
        throttleValue: 0,
        colony: 'b76$87bobo$88b2o$88bo6bo$94bo$94b3o$98b2o$98bobo$98bo2$78bo$79b2o$78b2o5$81b2o$80bobo$82bo2$83b3o$83bo$84bo!',
    },
];
