import {
    createSelector,
    createEntityAdapter 
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const gamesAdapter = createEntityAdapter({})

const initialState = gamesAdapter.getInitialState()

export const gamesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getGames: builder.query({
            query: () => '/games',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedGames = responseData.map(game => {
                    game.id = game._id
                    return game
                })
                return gamesAdapter.setAll(initialState, loadedGames)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Game', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Game', id}))
                    ]
                } else return [{type: 'Game', id: 'LIST'}]
            }
        }),
        addNewGame: builder.mutation({
            query: initialGameData => ({
                url: '/games',
                method: 'POST',
                body: {
                    ...initialGameData,
                }
            }),
            invalidatesTags: [
                {type: 'Game', id: 'LIST'}
            ]
        }),
        updateGame: builder.mutation({
            query: initialGameData => ({
                url: '/games',
                method: 'PATCH',
                body: {
                    ...initialGameData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Wargame', id: arg.id }
            ]
        }),
        deleteGame: builder.mutation({
            query: ({ id }) => ({
                url: '/games',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Game', id: arg.id }
            ]
        }),
        updateGameUser: builder.mutation({
            query: initialGameData => ({
                url: '/games/joined',
                method: 'PATCH',
                body: {
                    ...initialGameData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Wargame', id: arg.id}
            ]
        }),
        updateLeaveGame: builder.mutation({
            query: initialGameData => ({
                url: '/games/leave',
                method: 'PATCH',
                body: {
                    ...initialGameData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Wargame', id: arg.id}
            ]
        }),
    }),
})

export const {
    useGetGamesQuery, 
    useAddNewGameMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
    useUpdateGameUserMutation,
    useUpdateLeaveGameMutation
} = gamesApiSlice

// returns the query result object
export const selectGameResult = gamesApiSlice.endpoints.getGames.select()

// create memoized selector
const selectGamesData = createSelector(
    selectGameResult,
    gamesResult => gamesResult.data // normalized state object with ids & entities
)

// getSelectors create these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllGames,
    selectById: selectGameById,
    selectIds: selectGameIds
} = gamesAdapter.getSelectors(state => selectGamesData(state) ?? initialState)