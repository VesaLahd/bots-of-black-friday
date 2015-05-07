package fi.solita.botsofbf;


import fi.solita.botsofbf.dto.*;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyObject;

public class GameEngineTest {

    @Mock
    private PlayerClient playerClient;

    @Mock
    private UiClient uiClient;


    private List<String> mapLines = Arrays.asList(
            "halpahalli",
            "5",
            "xxxxxxx",
            "x__o__x ",
            "xxxxxxx");


    @Before
    public void initMocks(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void healthDecreasesBecauseOfInvalidMoves() {
        Player player = createPlayerToPos(1, 0);
        GameState state = new GameState(Map.createMapFromLines(Arrays.asList("nimi", "5", "x_o")))
                .addPlayer(player);
        Mockito.when(playerClient.askMoveFromPlayer(anyObject(), anyObject(), anyInt())).thenReturn(Move.LEFT);
        GameEngine gameEngine = new GameEngine(state, uiClient, playerClient);

        gameEngine.tick();

        assertEquals(player.health - GameState.HEALTH_LOST_WHEN_INVALID_MOVE,
                gameEngine.getCurrentState().getPlayer(player.id).health);
    }

    @Test
    public void deadPlayersAreRemoved() {
        Player player = createPlayerToPos(1, 0);
        GameState state = new GameState(Map.createMapFromLines(Arrays.asList("nimi", "5", "x_o")))
                .addPlayer(createPlayerToPos(1, 0))
                .addPlayer(player.decreaseHealth(99))
                .addPlayer(createPlayerToPos(1, 0));

        Mockito.when(playerClient.askMoveFromPlayer(anyObject(), anyObject(), anyInt())).thenReturn(Move.LEFT);
        GameEngine gameEngine = new GameEngine(state, uiClient, playerClient);

        assertEquals(3, gameEngine.getCurrentState().players.size());
        gameEngine.tick();
        assertEquals(2, gameEngine.getCurrentState().players.size());
    }


    private Player createPlayerToPos(int x, int y) {
        return Player.create(UUID.randomUUID().toString(), "url", Position.of(x, y));
    }

}