// src/inventoryRoutes.ts
import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({
    user: 'postgres', // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'api-inventory-db',
    password: '123', // Replace with your PostgreSQL password
    port: 5432,
});

// Create a new inventory item
router.post('/inventory', async (req: Request, res: Response) => {
    const { name, quantity, price } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO inventory (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
            [name, quantity, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all inventory items
router.get('/inventory', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM inventory');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single inventory item by id
router.get('/inventory/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update an inventory item by id
router.put('/inventory/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;

    try {
        const result = await pool.query(
            'UPDATE inventory SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING *',
            [name, quantity, price, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete an inventory item by id
router.delete('/inventory/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
