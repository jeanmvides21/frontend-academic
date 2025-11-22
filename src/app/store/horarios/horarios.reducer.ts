import { createReducer, on } from '@ngrx/store';
import { HorariosState, initialHorariosState } from './horarios.state';
import * as HorariosActions from './horarios.actions';

export const horariosReducer = createReducer(
  initialHorariosState,
  
  // Load Horarios
  on(HorariosActions.loadHorarios, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.loadHorariosSuccess, (state, { horarios }): HorariosState => ({
    ...state,
    horarios,
    loading: false,
    error: null,
  })),
  
  on(HorariosActions.loadHorariosFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Load Horarios by Usuario
  on(HorariosActions.loadHorariosByUsuario, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.loadHorariosByUsuarioSuccess, (state, { idUsuario, horarios }): HorariosState => ({
    ...state,
    horariosByUsuario: {
      ...state.horariosByUsuario,
      [idUsuario]: horarios,
    },
    loading: false,
    error: null,
  })),
  
  on(HorariosActions.loadHorariosByUsuarioFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Load Horario by ID
  on(HorariosActions.loadHorario, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.loadHorarioSuccess, (state, { horario }): HorariosState => ({
    ...state,
    selectedHorario: horario,
    loading: false,
    error: null,
  })),
  
  on(HorariosActions.loadHorarioFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Create Horario
  on(HorariosActions.createHorario, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.createHorarioSuccess, (state, { horario }): HorariosState => {
    const updatedHorarios = [...state.horarios, horario];
    const usuarioId = horario.id_usuario;
    const horariosUsuario = state.horariosByUsuario[usuarioId] || [];
    
    return {
      ...state,
      horarios: updatedHorarios,
      horariosByUsuario: {
        ...state.horariosByUsuario,
        [usuarioId]: [...horariosUsuario, horario],
      },
      loading: false,
      error: null,
    };
  }),
  
  on(HorariosActions.createHorarioFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Update Horario
  on(HorariosActions.updateHorario, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.updateHorarioSuccess, (state, { horario }): HorariosState => {
    const updatedHorarios = state.horarios.map((h) => (h.id === horario.id ? horario : h));
    const usuarioId = horario.id_usuario;
    const horariosUsuario = state.horariosByUsuario[usuarioId] || [];
    const updatedHorariosUsuario = horariosUsuario.map((h) => (h.id === horario.id ? horario : h));
    
    return {
      ...state,
      horarios: updatedHorarios,
      horariosByUsuario: {
        ...state.horariosByUsuario,
        [usuarioId]: updatedHorariosUsuario,
      },
      selectedHorario: state.selectedHorario?.id === horario.id ? horario : state.selectedHorario,
      loading: false,
      error: null,
    };
  }),
  
  on(HorariosActions.updateHorarioFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Delete Horario
  on(HorariosActions.deleteHorario, (state): HorariosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(HorariosActions.deleteHorarioSuccess, (state, { id }): HorariosState => {
    const horarioToDelete = state.horarios.find((h) => h.id === id);
    const updatedHorarios = state.horarios.filter((h) => h.id !== id);
    
    let updatedHorariosByUsuario = { ...state.horariosByUsuario };
    if (horarioToDelete) {
      const usuarioId = horarioToDelete.id_usuario;
      if (updatedHorariosByUsuario[usuarioId]) {
        updatedHorariosByUsuario[usuarioId] = updatedHorariosByUsuario[usuarioId].filter(
          (h) => h.id !== id
        );
      }
    }
    
    return {
      ...state,
      horarios: updatedHorarios,
      horariosByUsuario: updatedHorariosByUsuario,
      selectedHorario: state.selectedHorario?.id === id ? null : state.selectedHorario,
      loading: false,
      error: null,
    };
  }),
  
  on(HorariosActions.deleteHorarioFailure, (state, { error }): HorariosState => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Clear Error
  on(HorariosActions.clearHorariosError, (state): HorariosState => ({
    ...state,
    error: null,
  }))
);

