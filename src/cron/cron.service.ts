import { Injectable } from '@nestjs/common';
import { response } from 'express';
import { exec } from 'node:child_process';

@Injectable()
export class CronService {

    async refreshWallets() {

        exec('litecoin-cli listtransactions', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error.message}`);
            //   response.status(500).json({ error: error.message });
              return;
            }
            if (stderr) {
              console.error(`stderr: ${stderr}`);
            //   response.status(500).json({ error: stderr });
              return;
            }
            console.log(`stdout: ${stdout}`);
            // response.status(200).json({ result: JSON.parse(stdout) }); // Отправляем результат клиенту
          });
          
    }

}
