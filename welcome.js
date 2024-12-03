welcome_msg_1 = `
Notifications module INFO:
Este es un módulo de notificaciones que permite crear, actualizar, eliminar y mostrar notificaciones.
En este contexto, las notificaciones se refieren a trabajos lanzados por un sistema de gestión de tareas.
Este dicho sistema, será la UI, utilizará estas funciones para gestionar los trabajos en curso.
El sistema que consumirá este módulo está disponible en 
https://amalaguti.github.io/saltmgmt/
`
welcome_msg_2 = `
Las notificaciones tienen estados y dichos estados siguen ciertas reglas de transición.
3 grupos de estados: 
- Inicio
- En curso
- Finalizado.
`;
welcome_msg_3 = `
Cada grupo tiene sus estados definidos
- START = ["new", "queued", "scheduled"];
- RUNNING = ["in-progress", "paused", "delayed"];
- FINAL = ["completed", "failed", "canceled"];

las reglas definen las transiciones, por ejemplo, 
- una notificación en estado "new" puede pasar a "in-progress" o a "completed".
- una notificación en estado "in-progress" puede pasar a "paused" o a "completed".
- una notificación en estado "completed" no puede pasar a ningún otro estado.
`;
welcome_msg_4 = `
Los botones de control permiten cambiar el estado de una notificación.
Para modificar una notificación, primero se debe seleccionar la notificación desde el panel correspondiente
    `;
alert(welcome_msg_1);
alert(welcome_msg_2);
alert(welcome_msg_3);
alert(welcome_msg_4);