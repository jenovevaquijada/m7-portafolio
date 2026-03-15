require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false 
    }
);

const Producto = sequelize.define('Producto', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    url_imagen: { type: DataTypes.STRING } 
}, { tableName: 'articulos', timestamps: false });

// ENDPOINTS

// Obtener Productos
app.get('/articulos', async (req, res) => {
    try {
        const articulos = await Producto.findAll({ order: [['id', 'ASC']] });
        res.json(articulos);
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

// Crear Producto
app.post('/producto', async (req, res) => {
    try {
        const nuevo = await Producto.create(req.body);
        res.status(201).json(nuevo);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// Eliminar Producto 
app.delete('/producto/:id', async (req, res) => {
    try {
        await Producto.destroy({ where: { id: req.params.id } });
        res.json({ mensaje: "Producto eliminado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Registrar Venta
app.post('/venta', async (req, res) => {
    const { items } = req.body; 
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); 

        const totalVenta = items.reduce((acc, cur) => acc + (cur.precio * cur.cantidad), 0);
        const resVenta = await client.query(
            'INSERT INTO ventas (total) VALUES ($1) RETURNING id', 
            [totalVenta]
        );
        const idVenta = resVenta.rows[0].id;

        for (const item of items) {
            const resUpdate = await client.query(
                'UPDATE articulos SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING nombre',
                [item.cantidad, item.id_producto]
            );

            if (resUpdate.rowCount === 0) {
                throw new Error(`Stock insuficiente para el producto ID: ${item.id_producto}`);
            }

            await client.query(
                'INSERT INTO venta_items (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [idVenta, item.id_producto, item.cantidad, item.precio]
            );
        }

        await client.query('COMMIT'); 
        res.status(201).json({ ok: true, id_venta: idVenta });

    } catch (e) {
        await client.query('ROLLBACK'); 
        const status = e.message.includes('Stock') ? 409 : 500;
        res.status(status).json({ error: e.message });
    } finally {
        client.release();
    }
});

app.get('/ventas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ventas ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('🚀 Portafolio M7 en puerto 3000'));